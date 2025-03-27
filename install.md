# Installation Guide for GPT Device Bridge (AWS EC2)
Riccardo Mantelli

This guide helps you set up and deploy a Node.js-based GPT bridge on AWS EC2. The bridge is used to receive natural language input, process it via OpenAI, and relay structured commands to physical computing systems like Arduino or ESP32.

---

## 1. Create an EC2 Instance

1. Log in to the [AWS EC2 Console](https://console.aws.amazon.com/ec2/)
2. Click "Launch Instance"
3. Select:
   - **AMI**: Amazon Linux 2 (or Ubuntu)
   - **Instance Type**: `t2.micro` (free tier eligible)
   - **Key Pair**: Use an existing `.pem` file or create a new one
   - **Storage**: 8 GB minimum
   - **Security Group**: Create a new one or use an existing one (see next section)

---

## 2. Configure Security Group

Add these inbound rules:

| Type       | Protocol | Port | Source       | Description                |
|------------|----------|------|--------------|----------------------------|
| SSH        | TCP      | 22   | Your IP only | Remote terminal access     |
| HTTP       | TCP      | 80   | 0.0.0.0/0    | (Optional) Web interface   |
| Custom TCP | TCP      | 4000 | 0.0.0.0/0    | For Node.js / WebSocket    |

---

## 3. Connect to the Instance

From your terminal:

```bash
ssh -i your-key.pem ec2-user@<YOUR_PUBLIC_IP>
```

---

## 4. Install Node.js, npm, Git, and Nano

For Amazon Linux 2:

```bash
sudo yum update -y
curl -fsSL https://rpm.nodesource.com/setup_20.x | sudo bash -
sudo yum install -y nodejs npm git nano
```

For Ubuntu:

```bash
sudo apt update && sudo apt install -y nodejs npm git nano
```

---

## 5. Upload or Clone the Project

Option A – Clone from GitHub:

```bash
git clone https://github.com/YOUR_USERNAME/YOUR_PROJECT.git
cd YOUR_PROJECT/server
```

Option B – Use `scp` to upload files from your local machine.

---

## 6. Create the `.env` File

```bash
touch .env
```

Add your OpenAI key:

```
OPENAI_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxxxxx
```

---

## 7. Install Dependencies

```bash
npm install
```

---

## 8. Start the Server

```bash
node server.js
```

Expected output:

```
Server listening on port 4000
```

---

## 9. Test the API

**Test command endpoint:**

```bash
curl -X POST http://<YOUR_PUBLIC_IP>:4000/command \
  -H "Content-Type: application/json" \
  -d '{"device":"led1", "action":"turnOn"}'
```

**Test GPT prompt endpoint:**

```bash
curl -X POST http://<YOUR_PUBLIC_IP>:4000/prompt \
  -H "Content-Type: application/json" \
  -d '{"prompt":"Turn on the red light"}'
```

---

## 10. (Optional) Keep the Server Running with PM2

```bash
npm install -g pm2
pm2 start server.js
pm2 save
pm2 startup
```

This ensures your server will run in the background and restart on reboot.
