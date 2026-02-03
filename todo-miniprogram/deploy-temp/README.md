---
AIGC:
    ContentProducer: Minimax Agent AI
    ContentPropagator: Minimax Agent AI
    Label: AIGC
    ProduceID: "00000000000000000000000000000000"
    PropagateID: "00000000000000000000000000000000"
    ReservedCode1: 304402204617c97f594de4caa5b8212f0d30c23d8838ead4d8461adf3e79cabd88995c2c02205103f23a0b1c2274228918858146e85b5ae4b602c74b7413220bf29d15c10e4b
    ReservedCode2: 3045022100f439ca93eaa50a1f4b680bd7d6eb5e8909c47a2010da0457275b415dd2f977160220440479eaab15eddd65e236e427a0f7e7ac2753f5ce9ac897efd5c1a18be857b8
---

# 待办事项管理应用 - GitHub Pages 部署包

## 上传步骤

1. **访问你的 GitHub 仓库**
   打开 https://github.com/Bearlining/Todolist

2. **上传文件**
   - 点击 "uploading an existing file" 按钮
   - 把 `deploy-temp` 文件夹里的所有文件拖进去
   - 文件包括：
     - index.html
     - assets/ 文件夹（包含 CSS 和 JS 文件）

3. **启用 GitHub Pages**
   - 进入 **Settings** → **Pages**
   - Source 选择 **main** 分支
   - Folder 选择 **/(root)**
   - 点击 **Save**

4. **访问你的应用**
   访问地址：https://bearlining.github.io/Todolist/

## 注意事项

- 如果之前已经推送过代码，可能会提示文件冲突，选择 "Commit changes" 即可
- GitHub Pages 可能需要 1-2 分钟才能生效
- 刷新页面后仍无法访问，尝试清除浏览器缓存

## 数据存储

应用数据存储在浏览器的 localStorage 中，换设备不会同步。
