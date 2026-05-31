# Memory Card Game 项目逻辑介绍

## 一、项目架构概览

```mermaid
graph TD
    A[index.html] --> B[main.jsx]
    B --> C[App.jsx]
    C --> D[GameHeader.jsx]
    C --> E[Card.jsx]
    C --> F[WinMessage.jsx]
    C --> G[useGameLogics.js]
    G --> H{卡片数据}
    G --> I{游戏状态}
```

## 二、文件职责说明

| 文件 | 职责 | 类型 |
|------|------|------|
| `index.html` | 入口 HTML，定义根容器 | HTML |
| `main.jsx` | React 应用入口，挂载根组件 | React |
| `App.jsx` | 根组件，整合所有子组件 | React |
| `GameHeader.jsx` | 游戏头部，显示得分和移动次数 | Component |
| `Card.jsx` | 卡片组件，处理翻转动画 | Component |
| `WinMessage.jsx` | 胜利提示组件 | Component |
| `useGameLogics.js` | 游戏核心逻辑 Hook | Custom Hook |

## 三、游戏启动流程

```mermaid
sequenceDiagram
    participant HTML as index.html
    participant Main as main.jsx
    participant App as App.jsx
    participant Hook as useGameLogics.js

    HTML->>Main: 加载脚本
    Main->>Main: createRoot().render(<App />)
    Main->>App: 挂载组件
    App->>Hook: 调用 useGameLogic()
    Hook->>Hook: useEffect 触发 initializeGame()
    Hook->>Hook: shuffleArray() 打乱卡片
    Hook->>Hook: setCards() 创建卡片状态
    Hook-->>App: 返回 cards, score, moves...
    App-->>Main: 渲染完成
```

## 四、卡片点击交互流程

```mermaid
flowchart TD
    A[玩家点击卡片] --> B{拦截检查}
    B -->|已翻开/已匹配/锁定/两张已翻开| C[忽略点击]
    B -->|通过检查| D[翻转卡片 isFlipped=true]
    D --> E{是否是第二张卡片?}
    E -->|否| F[等待下一次点击]
    E -->|是| G[锁定游戏 isLocked=true]
    G --> H{两张卡片值相等?}
    H -->|是| I[延迟500ms]
    H -->|否| J[延迟1000ms]
    I --> K[标记匹配 isMatched=true]
    I --> L[得分+1]
    J --> M[翻回卡片 isFlipped=false]
    K --> N[解锁游戏]
    M --> N
    N --> O[移动次数+1]
```

## 五、状态管理关系

```mermaid
graph LR
    A[cards<br/>卡片数组] -->|isFlipped| B(Card组件)
    A -->|isMatched| B
    C[flippedCard<br/>已翻开卡片ID] -->|长度判断| D(匹配逻辑)
    E[matchedCards<br/>已匹配卡片ID] -->|长度对比| F{isGameComplete}
    G[score<br/>得分] --> H(GameHeader)
    I[moves<br/>移动次数] --> H
    J[isLocked<br/>锁定状态] -->|防止重复点击| D
```

## 六、核心数据结构

```mermaid
classDiagram
    class Card {
        +id: number
        +value: string
        +isFlipped: boolean
        +isMatched: boolean
    }
    
    class GameState {
        +cards: Card[]
        +flippedCard: number[]
        +matchedCards: number[]
        +score: number
        +moves: number
        +isLocked: boolean
    }
    
    GameState "1" *-- "*" Card : contains
```

## 七、匹配算法流程图

```mermaid
flowchart TB
    subgraph 初始化阶段
        A[cardValue数组] --> B[shuffleArray打乱]
        B --> C[map创建Card对象]
        C --> D[setCards存储状态]
    end
    
    subgraph 匹配阶段
        E[点击卡片] --> F[记录flippedCard]
        F --> G{已选2张?}
        G -->|否| H[等待]
        G -->|是| I[比较value]
        I --> J{相等?}
        J -->|是| K[标记匹配]
        J -->|否| L[翻回卡片]
    end
    
    subgraph 结束判断
        M[每次匹配后] --> N{matchedCards.length == cardValue.length?}
        N -->|是| O[游戏胜利]
        N -->|否| P[继续游戏]
    end
```

## 八、状态更新时序

```mermaid
sequenceDiagram
    participant User as 玩家
    participant Card as Card组件
    participant Hook as useGameLogics
    
    User->>Card: click
    Card->>Hook: handleCardClick(card)
    Hook->>Hook: setCards(isFlipped=true)
    Hook->>Hook: setFlippedCards([...prev, id])
    
    alt 第二张卡片
        Hook->>Hook: setIsLocked(true)
        
        alt 匹配成功
            Hook->>Hook: setTimeout(500ms)
            Hook->>Hook: setMatchedCards(...)
            Hook->>Hook: setScore(prev+1)
            Hook->>Hook: setCards(isMatched=true)
        else 匹配失败
            Hook->>Hook: setTimeout(1000ms)
            Hook->>Hook: setCards(isFlipped=false)
        end
        
        Hook->>Hook: setIsLocked(false)
        Hook->>Hook: setMoves(prev+1)
    end
```
