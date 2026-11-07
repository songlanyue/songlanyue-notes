# 松揽月笔记

> 松揽月笔记
>
> 计算机专业学生的个人作品站点 —— 纯手写 HTML / CSS / JavaScript，零框架、零构建、零外部依赖，
> 双击 `index.html` 即可在浏览器中打开，也可直接部署到任意 Linux + Nginx 服务器。

---

> 源码仓库：<https://github.com/songlanyue/songlanyue-notes>
> 线上地址：<https://songlanyue.xyz>
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
songlanyue-notes/
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
├── docs/               # 项目文档
│   ├── 01-作品展示.md   # 成品说明与截图清单
│   ├── 02-网站规划.md   # 需求、信息架构、设计决策
│   ├── 03-部署步骤记录.md # 从买服务器到备案的完整过程
│   └── images/         # 文档配图
├── .gitignore
└── README.md           # 本文件
```

## 四、功能说明

- **深色 / 浅色主题**：右上角按钮切换，选择写入 `localStorage`，首次访问跟随系统偏好。也可用 URL 参数直达：`?theme=light` / `?theme=dark`（分享链接或截图时不必手动点按钮）。
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

本项目使用 Git 管理，代码与文档在同一个仓库：

```bash
git add .
git commit -m "feat: 更新作品板块内容"
git push origin main
```

提交信息遵循 `<类型>: <说明>` 的格式，类型取 `feat`（新功能）、`fix`（修复）、`docs`（文档）、`style`（样式调整）、`chore`（杂项）。

服务器端：

```bash
cd /var/www/mywebsite && git pull origin main
```

静态文件无需重启 Nginx，浏览器刷新即可生效；若被浏览器缓存影响，可 `Ctrl + F5` 强制刷新。

### 改动流程（每次修改都必须走完）

本项目的原则是**仓库是唯一事实来源**，服务器只是部署目标：

```
修改 web/ 下的文件  →  git commit  →  git push  →  再部署到服务器
```

1. **先改本地**：在 `web/` 目录里改代码或文档，不要在服务器上直接改文件——否则仓库与线上不一致，版本记录就失真了。
2. **提交**：`git add -A && git commit -m "feat: 改动说明"`，提交信息写清「改了什么、为什么改」。
3. **推送**：`git push origin main`，改动记录同步到 https://github.com/songlanyue/songlanyue-notes 。
4. **部署**：`scp` 覆盖改动文件后 `systemctl reload nginx`，或在服务器上 `git pull`。
5. **验证**：`curl -I https://songlanyue.xyz/` 确认 200，并检查改动点是否生效。

这样每一次改动都对应仓库里的一条提交记录，线上任何一版都能追溯到具体提交。

## 八、常见问题

- **打开后样式错乱**：确认 `css/`、`js/`、`assets/` 与 `index.html` 的相对位置没有改变。
- **中文乱码**：`index.html` 已声明 `<meta charset="UTF-8">`，保存文件时也需使用 UTF-8 编码。
- **深色模式不生效**：清除站点数据或检查浏览器是否禁用了 `localStorage`（隐私模式下会自动降级为跟随系统）。
- **部署后打开是 Nginx 欢迎页**：说明站点配置未被加载，检查 `/etc/nginx/conf.d/` 下是否有其他 `default.conf`
  占用了 80 端口，以及 `nginx -t` 是否通过。

## 九、版权

页面内容与代码由本人编写，用于课程《开发工具与工程实践》期末作品展示。

### 图片素材与第三方版权

| 素材 | 位置 | 说明 |
| --- | --- | --- |
| `assets/hero-bg.webp` | 首屏背景 | **AI 生成的插画**（海堤夕阳、紫发少女）。画面角色「陈晖洁」的版权归 **鹰角网络（Hypergryph）** 所有。 |
| `assets/avatar.svg`、`assets/mascot.svg` | 关于我 / 联系区 | 本人原创 SVG，可自由使用。 |
| `assets/beian.png` | 页脚 | 公安部备案图标，仅用于展示备案号。 |

`hero-bg.webp` 仅用于本个人网站的非商业展示，**与鹰角网络官方无关**，不作为原创作品主张任何权利；
如版权方要求，可随时移除（删除该文件并把 `style.css` 中 `.hero::before` 的图片层去掉即可）。

页脚与首屏右下角均标注了上述信息来源。

