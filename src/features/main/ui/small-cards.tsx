import React from "react";
import { Button, Card } from "@heroui/react";

export const SmallCards: React.FC = () => {
  return (
    <div className="small-small-cards-container">
      {Array.from({ length: 3 }).map((_, index) => (
        <Card className="small-small-card" key={index}>
          {index === 0 && (
            <>
              <h3 className="small-small-card-title">Документация</h3>
              <p className="small-small-card-text">
                Рассказываем о фишках и лайфхаках работы с CustomGPT.
              </p>
              <Button className="small-small-card-button">Открыть</Button>
            </>
          )}
          {index === 1 && (
            <>
              <h3 className="small-small-card-title">Поддержка</h3>
              <p className="small-small-card-text">
                Отвечаем на любые вопросы и предлагаем решения.
              </p>
              <Button className="small-small-card-button">Написать</Button>
            </>
          )}
          {index === 2 && (
            <>
              <h3 className="small-small-card-title">Разработка</h3>
              <p className="small-small-card-text">
                Дорабатываем функционал под Ваши потребности.
              </p>
              <Button className="small-small-card-button">Заказать</Button>
            </>
          )}
        </Card>
      ))}
    </div>
  );
};
