# Factorio Server Manager — Linux 部署指南

## 环境要求

| 项目 | 要求 |
|------|------|
| 操作系统 | Linux (amd64) |
| Factorio | 已安装 Factorio 无头服务器 |
| 端口 | 80 (Web 管理界面，可自定义) |
| 磁盘 | 预留足够空间存放存档和 Mod |

---

## 第一步：下载

从 [GitHub Releases](https://github.com/CNdahan/factorio-server-manager/releases) 下载最新的 `factorio-server-manager-linux.zip`。

```bash
wget https://github.com/CNdahan/factorio-server-manager/releases/download/latest/factorio-server-manager-linux.zip
unzip factorio-server-manager-linux.zip
cd factorio-server-manager
chmod +x factorio-server-manager
```

解压后的目录结构：
```
factorio-server-manager/
  factorio-server-manager   ← Go 后端 (可执行文件)
  bundle.js                 ← 前端 UI
  style.css                 ← 前端样式
  conf.json                 ← 配置文件
  index.html                ← 入口页面
  fonts/                    ← 字体资源
  images/                   ← 图片资源
```

---

## 第二步：安装 Factorio 无头服务器

FSM 依赖 Factorio 服务器二进制文件，需要先安装 Factorio。

### 方式 A：SteamCMD（推荐）

```bash
# 安装 SteamCMD
sudo apt-get install steamcmd

# 下载 Factorio
steamcmd +login anonymous +force_install_dir /opt/factorio +app_update 739590 +quit
```

### 方式 B：官网下载

从 [factorio.com/download](https://factorio.com/download) 下载 Linux 无头服务器包，解压到目标目录：

```bash
tar -xf factorio_headless_x64_*.tar.xz -C /opt/factorio
```
> 注意：`.tar.xz` 用 `-J` (xz) 解压，或直接用 `-xf` 让 tar 自动检测格式，**不要加 `-z`**（那是 gzip 用的）。

安装后确认二进制文件存在：
```bash
/opt/factorio/bin/x64/factorio --version
```

---

## 第三步：配置 FSM

编辑 `conf.json`：

```json
{
    "sq_lite_database_file": "sqlite.db",
    "settings_file": "server-settings.json",
    "log_file": "factorio-server-manager.log",
    "rcon_pass": "",
    "cookie_encryption_key": "",
    "factorio_dir": "/opt/factorio",
    "mod_pack_dir": "./mod_packs",
    "console_cache_size": 25,
    "secure": false
}
```

> **说明**：`cookie_encryption_key` 和 `rcon_pass` 首次启动时会自动生成，无需手动填写。

---

## 第四步：启动

### 直接启动

```bash
# 确保在 factorio-server-manager 目录下
./factorio-server-manager
```

### 常用启动参数

| 参数 | 说明 | 默认值 |
|------|------|--------|
| `--dir` | Factorio 安装目录 | `./` |
| `--port` | Web 界面端口 | `80` |
| `--host` | 监听 IP | `0.0.0.0` |
| `--bin` | Factorio 二进制路径 | `bin/x64/factorio` |
| `--conf` | FSM 配置文件路径 | `./conf.json` |
| `--rcon-port` | RCON 端口 | 自动生成 |
| `--autostart` | 启动时自动启动 Factorio | `false` |

### 完整示例

```bash
./factorio-server-manager \
  --dir /opt/factorio \
  --port 8080 \
  --host 0.0.0.0 \
  --autostart true
```

启动成功后访问：`http://你的服务器IP:8080`

---

## 第五步：配置 systemd 服务（开机自启）

创建服务文件：

```bash
sudo nano /etc/systemd/system/factorio-server-manager.service
```

写入以下内容（注意修改路径）：

```ini
[Unit]
Description=Factorio Server Manager
After=network.target

[Service]
Type=simple
User=factorio
Group=factorio
WorkingDirectory=/opt/factorio-server-manager
ExecStart=/opt/factorio-server-manager/factorio-server-manager \
  --dir /opt/factorio \
  --port 8080 \
  --autostart true
Restart=always
RestartSec=5

[Install]
WantedBy=multi-user.target
```

启用并启动：

```bash
sudo systemctl daemon-reload
sudo systemctl enable factorio-server-manager
sudo systemctl start factorio-server-manager
sudo systemctl status factorio-server-manager
```

---

## 第六步：首次登录

1. 浏览器打开 `http://服务器IP:端口`
2. 默认管理员账号：**admin** / 密码：**admin**
3. 登录后建议立即修改密码（用户管理 → 修改密码）

---

## 目录结构全景

```
/opt/factorio/                       ← Factorio 服务器目录
  bin/x64/factorio                   ← Factorio 二进制
  data/base/                         ← 游戏数据
  saves/                             ← 存档目录
  mods/                              ← Mod 目录
  config/
    server-settings.json             ← 服务器设置
    server-adminlist.json            ← 管理员列表

/opt/factorio-server-manager/        ← FSM 目录
  factorio-server-manager            ← FSM 二进制
  bundle.js / style.css              ← 前端
  conf.json                          ← FSM 配置
  sqlite.db                          ← 用户数据库
  mod_packs/                         ← Mod 包存储
```

---

## 常见问题

### 启动报 "Error opening file: conf.json"

确认在 `factorio-server-manager` 目录下运行，或通过 `--conf` 指定路径。

### 启动报 "unable to execute factorio binary"

Factorio 路径不对。用 `--dir` 和 `--bin` 指向正确位置：
```bash
./factorio-server-manager --dir /opt/factorio --bin bin/x64/factorio
```

### 端口被占用

换一个端口：
```bash
./factorio-server-manager --port 8080
```

### 查看日志

```bash
tail -f factorio-server-manager.log
```
