import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { Client as FTPClient } from "basic-ftp";
import * as fs from "fs";
import * as path from "path";
import { initializeDatabase } from "../config/database";
import { Message } from "../entities/Message";
import { ExportControl } from "../entities/ExportControl";
import { MoreThan } from "typeorm";

export async function ExportMessagesToFTP(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log('ExportMessagesToFTP function triggered at:', new Date().toISOString());

    const ftpConfig = {
        host: process.env.FTP_HOST || "",
        port: parseInt(process.env.FTP_PORT || "21"),
        user: process.env.FTP_USER || "",
        password: process.env.FTP_PASSWORD || "",
        secure: process.env.FTP_SECURE === "true", // true for FTPS
        remotePath: process.env.FTP_REMOTE_PATH || "/"
    };

    // Validate FTP configuration
    if (!ftpConfig.host || !ftpConfig.user || !ftpConfig.password) {
        context.warn('FTP configuration incomplete. Skipping export. Please configure FTP_HOST, FTP_USER, and FTP_PASSWORD.');
        return {
            status: 400,
            body: JSON.stringify({
                error: 'FTP configuration incomplete. Please configure FTP_HOST, FTP_USER, and FTP_PASSWORD.'
            })
        };
    }

    try {
        // Initialize database connection
        const dataSource = await initializeDatabase();
        const messageRepository = dataSource.getRepository(Message);
        const exportControlRepository = dataSource.getRepository(ExportControl);

        // Get or create export control record
        let exportControl = await exportControlRepository.findOne({
            where: { export_type: 'messages_ftp' }
        });

        if (!exportControl) {
            // First time export - create control record
            exportControl = exportControlRepository.create({
                export_type: 'messages_ftp',
                last_export_at: new Date('2000-01-01'), // Start from beginning
                total_records_exported: 0
            });
            await exportControlRepository.save(exportControl);
            context.log('Created new export control record');
        }

        context.log(`Last export was at: ${exportControl.last_export_at}`);

        // Fetch messages that are new or updated since last export
        const messages = await messageRepository.find({
            where: [
                { created_at: MoreThan(exportControl.last_export_at) },
                { updated_at: MoreThan(exportControl.last_export_at) }
            ],
            order: { updated_at: 'ASC' }
        });

        if (messages.length === 0) {
            context.log('No new or updated messages to export.');
            return {
                status: 200,
                body: JSON.stringify({
                    message: 'No new or updated messages to export.',
                    last_export_at: exportControl.last_export_at
                })
            };
        }

        context.log(`Found ${messages.length} message(s) to export.`);

        // Generate markdown content
        const markdownContent = generateMarkdown(messages);

        // Create temporary file
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const filename = `messages-export-${timestamp}.md`;
        const tempDir = process.env.TEMP || '/tmp';
        const tempFilePath = path.join(tempDir, filename);

        fs.writeFileSync(tempFilePath, markdownContent, 'utf8');
        context.log(`Markdown file created: ${tempFilePath}`);

        // Upload to FTP
        const ftpClient = new FTPClient();
        ftpClient.ftp.verbose = true;

        try {
            await ftpClient.access({
                host: ftpConfig.host,
                port: ftpConfig.port,
                user: ftpConfig.user,
                password: ftpConfig.password,
                secure: ftpConfig.secure
            });
            context.log('Connected to FTP server');

            // Change to remote directory if specified
            if (ftpConfig.remotePath && ftpConfig.remotePath !== '/') {
                await ftpClient.ensureDir(ftpConfig.remotePath);
                context.log(`Changed to remote directory: ${ftpConfig.remotePath}`);
            }

            // Upload file
            await ftpClient.uploadFrom(tempFilePath, filename);
            context.log(`File uploaded successfully: ${filename}`);

            // Update export control
            exportControl.last_export_at = new Date();
            exportControl.total_records_exported += messages.length;
            await exportControlRepository.save(exportControl);
            context.log('Export control updated');

            return {
                status: 200,
                body: JSON.stringify({
                    success: true,
                    message: `Exported ${messages.length} message(s) successfully`,
                    filename: filename,
                    total_exported: messages.length,
                    last_export_at: exportControl.last_export_at
                })
            };

        } catch (ftpError: any) {
            context.error('FTP upload failed:', ftpError?.message || ftpError);
            return {
                status: 500,
                body: JSON.stringify({
                    error: 'FTP upload failed',
                    details: ftpError?.message || String(ftpError)
                })
            };
        } finally {
            ftpClient.close();
            // Clean up temporary file
            if (fs.existsSync(tempFilePath)) {
                fs.unlinkSync(tempFilePath);
                context.log('Temporary file cleaned up');
            }
        }

    } catch (error: any) {
        context.error('Error during export:', error?.message || error);
        return {
            status: 500,
            body: JSON.stringify({
                error: 'Export failed',
                details: error?.message || String(error)
            })
        };
    }
}

function generateMarkdown(messages: Message[]): string {
    const now = new Date();
    const dateStr = now.toISOString().split('T')[0];
    
    let markdown = `# Messages Export - ${dateStr}\n\n`;
    markdown += `**Export Date:** ${now.toLocaleString('en-US')}\n\n`;
    markdown += `**Total Messages:** ${messages.length}\n\n`;
    markdown += `---\n\n`;

    messages.forEach((msg, index) => {
        markdown += `## Message ID: ${msg.id}\n\n`;
        markdown += `- **Text:** ${msg.message_text}\n`;
        markdown += `- **Created:** ${msg.created_at.toLocaleString('en-US')}\n`;
        markdown += `- **Updated:** ${msg.updated_at.toLocaleString('en-US')}\n`;
        
        if (index < messages.length - 1) {
            markdown += `\n---\n\n`;
        }
    });

    return markdown;
}

// HTTP trigger - manual export to FTP
app.http('ExportMessagesToFTP', {
    methods: ['POST', 'GET'],
    authLevel: 'anonymous',
    route: 'export-ftp',
    handler: ExportMessagesToFTP
});
