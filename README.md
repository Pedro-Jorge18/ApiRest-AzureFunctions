# REST API with Azure Functions, TypeORM, and PostgreSQL

## Prerequisites

- Windows 10/11 with WSL2
- Ubuntu (installed via WSL)

## Technology Stack

- **Node.js 20+**: JavaScript runtime
- **TypeScript 5+**: Typed superset of JavaScript
- **Azure Functions V4**: Serverless compute
- **TypeORM 0.3+**: ORM for TypeScript
- **PostgreSQL 16**: Relational database
- **Podman 4.9+**: Container engine
- **WSL 2**: Windows Subsystem for Linux

## Quick Start


To quickly set up the project, ensure WSL, Node.js, Podman, and Azure Functions Core Tools are installed.
Then, complete the following steps:

### 1. Clone the Repository

```bash
git clone https://github.com/Pedro-Jorge18/ApiRest-AzureFunctions.git
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables


Copy the example environment file and update the credentials as needed:

```bash
cp .env.example .env
nano .env  # Add your credentials
```

### 4. Compile TypeScript

```bash
npm run build
```

### 5. Initialize Containers (Postgres + API)

```bash
podman-compose up --build -d
```

### 6. Run Database Migrations

1. Edit the `.env` file and set `DB_HOST=localhost` (instead of `DB_HOST=postgres-db`).
2. Run migrations:
   ```bash
   npm run migration:run
   ```
3. Restore the `.env` file to `DB_HOST=postgres-db` after migrations are complete.

### 7. Start Azure Functions Locally

```bash
func start
```

### 8. Restart the API

```bash
podman-compose restart api-functions
```

### 9. Test the API

```bash
curl http://localhost:8080/api/messages
```

---

## Installation and Configuration

Instructions for installing and configuring WSL, Node.js, Podman, Azure Functions Core Tools, and the Postgres Docker image:

### 1º Step Install and Update WSL


Open Command Prompt as Administrator and execute:

```cmd
wsl
```
WSL installation may take several minutes. A system reboot is recommended after installation.

To list available distributions, execute:
```cmd
wsl.exe --list --online
```
This displays all available distributions.

To install Ubuntu, execute:
```cmd
wsl.exe --install Ubuntu
```

After installation, create a default Unix user account and password as prompted.

Update and upgrade Ubuntu packages:
```bash
sudo apt update
sudo apt upgrade
```

This refreshes the package list and updates available software.

### 2º Step - Install NPM and Node


Refer to the official Microsoft documentation for installing Node.js and NPM on WSL:
https://learn.microsoft.com/en-us/windows/dev-environment/javascript/nodejs-on-wsl

Alternatively, use the following commands to install nvm, Node.js, and NPM:


Install curl (if not already installed):
```bash
sudo apt-get install curl
```


Install nvm:
```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/master/install.sh | bash
```

Verify installation:
```bash
command -v nvm
```

The command should return 'nvm'. If 'command not found' is returned or there is no response, close and reopen the terminal, then try again.

List installed Node.js versions (should be none initially):
```bash
nvm ls
```

Install the current and stable LTS versions of Node.js:
```bash
nvm install --lts
nvm install node
```

Verify that Node.js and NPM are installed and set as default:
```bash
node --version
npm --version
```

If the following error appears:
```bash
node: error while loading shared libraries: libatomic.so.1: cannot open shared object file: No such file or directory
```
Install the missing library:
```bash
sudo apt install libatomic1
```

Retry the previous command after installation.

This error indicates Node.js cannot find the required system library 'libatomic', which is common on minimal Linux installations.

### 3º Step - Install PODMAN and Postgres docker image

https://podman.io/docs/installation


To install Podman, execute:
```bash
sudo apt install -y podman
```


Verify Podman installation:
```bash
podman info
```

If a Zscaler Root CA certificate is required, export it from Windows:
1. Press Win + R, type `certlm.msc`, and press Enter.
2. Locate the certificate in `Trusted Root Certification Authorities > Certificates` (named Zscaler Root CA).
3. Right-click, select All Tasks > Export, and follow the prompts.
4. Select the Base-64 encoded X.509 (.CER) option.
5. Save the file to a location accessible from WSL.

In Ubuntu (WSL), install and update certificates:
```bash
sudo apt-get install -y ca-certificates
sudo cp /mnt/c/path/to/cert.cer /usr/local/share/ca-certificates/zscalar.crt
sudo update-ca-certificates
```

After updating certificates, install the Postgres Docker image:
```bash
podman pull docker.io/library/postgres
```

Verify the installation:
```bash
podman images
```

### 4º Step - Install Azure Functions Core Tools

https://learn.microsoft.com/en-us/azure/azure-functions/functions-run-local?tabs=linux%2Cisolated-process%2Cnode-v4%2Cpython-v2%2Chttp-trigger%2Ccontainer-apps&pivots=programming-language-typescript


To install Azure Functions Core Tools, execute:
```bash
curl https://packages.microsoft.com/keys/microsoft.asc | gpg --dearmor > microsoft.gpg
sudo mv microsoft.gpg /etc/apt/trusted.gpg.d/microsoft.gpg
```

This command installs the Microsoft package repository GPG key to validate package integrity.

Set up the APT source list:
```bash
sudo sh -c 'echo "deb [arch=amd64] https://packages.microsoft.com/repos/microsoft-ubuntu-$(lsb_release -cs 2>/dev/null)-prod $(lsb_release -cs 2>/dev/null) main" > /etc/apt/sources.list.d/dotnetdev.list'
```

This command sets up the APT source list before updating.

Update package lists:
```bash
sudo apt-get update
```

Install the Core Tools package:
```bash
sudo apt-get install azure-functions-core-tools-4
```

Verify the installation:
```bash
func --version
```


## Useful Commands


Compile TypeScript:
```bash
npm run build
```

Compile in watch mode:
```bash
npm run watch
```

Clean dist folder:
```bash
npm run clean
```

Run migrations:
```bash
npm run migration:run
```

Revert last migration:
```bash
npm run migration:revert
```

Create new migration:
```bash
npm run migration:create src/migrations/NameMigration
```


## Podman Commands

See running containers:
```bash
podman ps
```

See all containers:
```bash
podman ps -a
```

See logs of a container:
```bash
podman logs api-functions
podman logs postgres-db
```

Enter a container:
```bash
podman exec -it postgres-db psql -U <user> -d apidb
```

Stop all containers:
```bash
podman-compose down
```

Remove volumes:
```bash
podman-compose down -v
```

## Database Commands

Install PostgreSQL Client:
```bash
sudo apt install postgresql-client  
```

Connect to the Database:
```bash
psql -h localhost -U <username> -d <databasename>
```

List Databases:
```sql
\l
```

List Tables:
```sql
\dt
```

View Table Structure:
```sql
\d name_of_the_table
```

View Table Content:
```sql
SELECT * FROM name_of_the_table;
```

Exit psql
```sql
\q
```











