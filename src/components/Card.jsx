
export const Card = ({ card, onClick }) => {
    return (
        <div className={`card ${card.isFlipped ? "flipped" : ""} 
        ${card.isMatched ? "matched" : ""
            }`} onClick={() => onClick(card)}>
            {/* 通过修改 opacity 实现卡片、问号的隐藏和显示 */}
            <div className="card-front">?</div>
            <div className="card-back">{card.value}</div>
        </div>
    )
}