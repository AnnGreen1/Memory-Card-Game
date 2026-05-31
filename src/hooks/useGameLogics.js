import { useEffect, useState } from "react";
export const useGameLogic = (cardValue) => {
  const [cards, setCards] = useState([]); // 卡片数组
  const [flippedCard, setFlippedCards] = useState([]); // 翻开的卡片数组
  const [matchedCards, setMatchedCards] = useState([]); // 匹配的卡片数组
  const [score, setScore] = useState(0); // 得分
  const [moves, setMoves] = useState(0); // 移动次数
  const [isLocked, setIsLocked] = useState(false); // 是否锁定

  // 数组随机打乱
  const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const initializeGame = () => {
    const shuffled = shuffleArray(cardValue);

    const finalCards = shuffled.map((value, index) => ({
      id: index,
      value,
      isFlipped: false, // 是否翻开
      isMatched: false, // 是否匹配
    }));

    setCards(finalCards);
    setIsLocked(false);
    setMoves(0);
    setScore(0);
    setMatchedCards([]);
    setFlippedCards([]);
  };

  // 等价于 vue 中的 onMounted
  useEffect(() => {
    initializeGame();
  }, []);

  /**
   * 处理卡片点击事件的核心函数
   * @param {Object} card - 被点击的卡片对象
   * @param {number} card.id - 卡片唯一标识
   * @param {string} card.value - 卡片内容值（用于匹配判断）
   * @param {boolean} card.isFlipped - 是否已翻开
   * @param {boolean} card.isMatched - 是否已匹配成功
   */
  const handleCardClick = (card) => {
    // 拦截条件：卡片已翻开、已匹配、游戏锁定、已有两张卡片翻开时，不处理点击
    if (
      card.isFlipped ||      // 卡片已翻开，不重复处理
      card.isMatched ||      // 卡片已匹配，无需再点击
      isLocked ||            // 游戏处于锁定状态（正在判断匹配）
      flippedCard.length === 2 // 已有两张卡片翻开，等待判断结果
    ) {
      return;
    }

    // 1. 将点击的卡片翻转为翻开状态
    const newCards = cards.map((c) => {
      if (c.id === card.id) {
        return { ...c, isFlipped: true };
      } else {
        return c;
      }
    });

    // 更新卡片状态，触发UI翻转动画
    setCards(newCards);
    // 将当前卡片ID加入已翻开数组
    const newFlippedCards = [...flippedCard, card.id];
    setFlippedCards(newFlippedCards);

    // 2. 判断是否是第二张卡片（已有一张翻开时）
    if (flippedCard.length === 1) {
      // 锁定游戏，防止在判断期间再次点击
      setIsLocked(true);
      // 获取第一张翻开的卡片
      const firstCard = cards[flippedCard[0]];

      // 3. 匹配判断：两张卡片的值是否相等
      if (firstCard.value === card.value) {
        // 匹配成功：延迟500ms后更新状态（给玩家视觉反馈时间）
        setTimeout(() => {
          // 将两张卡片加入匹配成功列表
          setMatchedCards((prev) => [...prev, firstCard.id, card.id]);
          // 得分+1
          setScore((prev) => prev + 1);
          // 标记两张卡片为已匹配状态（保持翻开）
          setCards((prev) =>
            prev.map((c) => {
              if (c.id === card.id || c.id === firstCard.id) {
                return { ...c, isMatched: true };
              } else {
                return c;
              }
            })
          );
          // 清空已翻开数组
          setFlippedCards([]);
          // 解锁游戏
          setIsLocked(false);
        }, 500);
      } else {
        // 匹配失败：延迟1000ms后将卡片翻回（给玩家更长时间记忆位置）
        setTimeout(() => {
          // 将两张卡片翻回背面
          const flippedBackCard = newCards.map((c) => {
            if (newFlippedCards.includes(c.id) || c.id === card.id) {
              return { ...c, isFlipped: false };
            } else {
              return c;
            }
          });

          // 更新卡片状态为翻回
          setCards(flippedBackCard);
          // 清空已翻开数组
          setFlippedCards([]);
          // 解锁游戏
          setIsLocked(false);
        }, 1000);
      }

      // 4. 无论匹配成功或失败，移动次数+1
      setMoves((prev) => prev + 1);
    }
  };

  const isGameComplete = matchedCards.length === cardValue.length;

  return {
    cards,
    score,
    moves,
    isGameComplete,
    initializeGame,
    handleCardClick,
  };
};
