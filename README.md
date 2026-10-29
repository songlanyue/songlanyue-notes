# 松揽月笔记

> 松揽月笔记
>
> 计算机专业学生的个人作品站点 —— 纯手写 HTML / CSS / JavaScript，零框架、零构建、零外部依赖，
> 双击 `index.html` 即可在浏览器中打开，也可直接部署到任意 Linux + Nginx 服务器。

---

## 一、项目简介

这是一个单页个人网站，包含「首页 / 关于我 / 技能 / 作品 / 经历 / 联系」六个板块，用于展示个人介绍、
技能栈、课程与个人项目、学习经历以及联系方式。

设计上强调三点：

1. **轻**：没有框架、没有打包工具、没有 CDN 依赖，全部源码加起来不到 100 KB，首屏无需等待任何外部资源。
2. **可读**：语义化标签 + CSS 变量组织样式，改颜色只改 `:root` 里的十几个变量即可。
3. **能跑**：既支持本地 `file://` 直接双击打开（方便交作业和演示），也支持部署到自己的服务器上。

## 二、技术栈

| 分类 | 内容 |
| --- | --- |
| 页面结构 | HTML5 语义化标签 |
| 样式 | 原生 CSS3（自定义属性、Grid / Flex、`color-mix`、渐变与过渡动画） |
| 交互 | 原生 JavaScript（ES5 语法，无构建步骤） |
| 响应式 | 媒体查询，适配 1440 / 1024 / 900 / 640 四档 |
| 部署 | Linux（Ubuntu）+ Nginx 静态站点 |

第三方依赖：**无**。字体使用系统中文字体栈（苹方 / 微软雅黑 / 思源），不请求任何外网资源。

## 三、目录结构

```
网站源码/
├── index.html          # 页面结构（唯一入口）
├── css/
│   └── style.css       # 全部样式，含深色模式与响应式
├── js/
│   └── main.js         # 主题切换、移动端菜单、滚动高亮、渐显动效
├── assets/
│   ├── favicon.svg     # 站点图标
│   ├── avatar.svg      # 头像插画（矢量，可替换为 jpg/png）
│   ├── mascot.svg      # 吉祥物（联系区右下角，纯手写 SVG）
│   └── beian.png       # 公安备案标准图标（36×40，来自公安部下发）
└── README.md           # 本文件
```

## 四、功能说明

- **深色 / 浅色主题**：右上角按钮切换，选择写入 `localStorage`，首次访问跟随系统偏好。
- **响应式导航**：≤900px 折叠为汉堡菜单，点击链接、点击空白处或按 `Esc` 自动收起。
- **滚动联动**：顶部阅读进度条、导航项随滚动高亮、超过一屏后出现「回到顶部」按钮。
- **渐显动效**：基于 `IntersectionObserver`，元素进入视口时错峰淡入；系统开启「减少动态效果」时自动关闭。
- **无障碍**：`aria-label` / `aria-expanded` / `aria-current`、键盘 `:focus-visible` 焦点样式、图片 `alt` 文本。

## 五、本地预览

**方式一（最简单）**：直接双击 `index.html`，用浏览器打开。

**方式二（推荐用服务器方式预览，行为与线上一致）**：

```bash
# 任选其一，在项目根目录执行
python3 -m http.server 8080        # 然后访问 http://localhost:8080
# 或
npx serve .
```

## 六、部署说明（概要）

站点是纯静态文件，部署只需三步：上传 → 指定站点根目录 → 重载 Nginx。

```bash
# 1. 上传（推荐在服务器上用 git pull；也可本地 scp）
scp -r ./* root@<服务器公网IP>:/var/www/mywebsite/

# 2. Nginx 站点配置 /etc/nginx/conf.d/mywebsite.conf
server {
    listen 80;
    server_name _;
    root /var/www/mywebsite;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}

# 3. 检查并重载
nginx -t && systemctl reload nginx
```

完整的分步命令（含服务器购买、SSH 登录、Nginx 安装、权限设置、版本更新流程）见作业中的
`03-部署步骤记录.md`。

## 七、更新与版本管理

```bash
git add .
git commit -m "feat: 更新作品板块内容"
git push origin main
```

服务器端：

```bash
cd /var/www/mywebsite && git pull origin main
```

静态文件无需重启 Nginx，浏览器刷新即可生效；若被浏览器缓存影响，可 `Ctrl + F5` 强制刷新。

## 八、常见问题

- **打开后样式错乱**：确认 `css/`、`js/`、`assets/` 与 `index.html` 的相对位置没有改变。
- **中文乱码**：`index.html` 已声明 `<meta charset="UTF-8">`，保存文件时也需使用 UTF-8 编码。
- **深色模式不生效**：清除站点数据或检查浏览器是否禁用了 `localStorage`（隐私模式下会自动降级为跟随系统）。
- **部署后打开是 Nginx 欢迎页**：说明站点配置未被加载，检查 `/etc/nginx/conf.d/` 下是否有其他 `default.conf`
  占用了 80 端口，以及 `nginx -t` 是否通过。

## 九、版权

页面内容与代码由本人编写，用于课程《开发工具与工程实践》期末作品展示。
