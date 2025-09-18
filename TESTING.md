本文档描述了 `BigBrain` 前端项目的测试策略、结构与命令。内容涵盖 **组件测试**（使用 Cypress）与 **端到端（E2E）测试**（同样使用 Cypress）。

## 前置条件

* 在 `frontend` 目录下安装依赖：

  ```bash
  cd frontend
  npm install
  ```

* 后端服务需运行在 `http://localhost:5005`：

  ```bash
  cd backend
  npm install
  ```

## 运行测试

在 `frontend` 文件夹下执行以下命令以打开 Cypress：

```bash
npm run test
```

* 选择 **Component** 测试可运行 `*.cy.jsx` 组件测试用例。
* 选择 **E2E** 测试可运行 `cypress/e2e/*.cy.jsx` 测试用例。

## 组件测试

```shell
npm run test
```

组件测试通过 `cypress/react` 挂载单个 React 组件并在隔离环境中运行。所有测试文件存放于 `frontend/cypress/component/`。

### CreateSessionModal.cy.jsx

* **目的**：验证 `CreateSessionModal` 是否正确渲染标题、会话 ID、复制链接按钮，并确认 `onCancel` 回调及剪贴板复制功能是否正常。
* **关键测试**：
  1. 渲染标题与会话代码。
  2. 点击 **Close** 按钮时触发 `onCancel`。
  3. 模拟 `navigator.clipboard.writeText` 并确认在点击 **Copy Link** 时被调用，同时校验 AntD 提示消息出现。

### CustomCard.cy.jsx

* **目的**：确保 `CustomCard` 能正确显示封面图片、标题、题目数量与描述。
* **关键测试**：

  1. `<img>` 元素的 `src` 属性与传入的 `game.image` 一致。
  2. 标题、“Questions number: X” 与描述可见。

### QuestionCard.cy.jsx

* **目的**：确认 `QuestionCard` 能展示题目标题与元信息，并正确触发 `onEdit` 与 `onDelete`。
* **关键测试**：

  1. 渲染标题、题型、分数与时间限制。
  2. 点击 **Edit** 图标时调用 `onEdit(question.id)`。
  3. 点击 **Delete** 按钮并在 Popconfirm 中确认时调用 `onDelete(question.id)`。

## 端到端测试（Happy Path）

```shell
cd backend
npm start
cd frontend
npm run dev
npm run test
```

测试文件位于 `frontend/cypress/e2e/happyPath.cy.jsx`，模拟管理员完整的工作流程：

1. **注册** 一个新用户（基于时间戳生成唯一邮箱）。
2. 使用该用户 **登录**。
3. **创建** 一个新游戏（手动输入），并验证成功。
4. **启动** 游戏并确认会话启动消息出现。
5. 通过会话链接进入答题页面，再返回。
6. **结束** 游戏会话，确认结束操作并查看结果。
7. **登出** 并验证已重定向到 `/login`。
8. **再次登录** 并确认游戏仍显示在控制面板中。

该测试覆盖了管理员核心功能的“Happy Path”（顺利路径）。
