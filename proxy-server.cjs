const httpProxy = require("http-proxy");
const http = require("http");
const dotenv = require("dotenv");
const path = require("path");

const {
  parsed: { VITE_API_BASE_URL },
} = dotenv.config({ path: [path.join(__dirname, ".env.development.local"), path.join(__dirname, ".env.development")] });
const API_HOST = VITE_API_BASE_URL.replace("/api/", "");

const proxy = httpProxy.createProxyServer({});

proxy.on("error", function (err, req, res) {
  res.writeHead(502, {
    "Content-Type": "text/plain",
  });
  console.error("Proxy error:", err);
  res.end("Proxy Error: Could not connect to target server.");
});

const server = http.createServer(function (req, res) {
  try {
    const firstNode = req.url?.split("/")?.[1];
    const url = req.url || '';
    
    // 检查是否是文件导入请求（包含.uts扩展名和import查询参数）
    const isFileImport = url.includes('.uts?import') || url.includes('import');
    
    if ((req.url?.startsWith("/files/") || req.url?.startsWith("/api/")) && !isFileImport) {
      // 真正的API请求，转发到后端API服务器
      console.log(`Proxying API request: ${req.url} -> ${API_HOST}`);
      proxy.web(req, res, { target: API_HOST, changeOrigin: true });
    } else {
      proxy.web(req, res, { target: "http://localhost:5173", changeOrigin: true });
    }
  } catch (err) {
    console.log("Proxy server error: ", err);
  }
});

console.log("Proxy server listen port: ", 8000);
server.listen(8000);
