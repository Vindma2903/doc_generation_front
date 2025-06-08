import React from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@nextui-org/react";

const PopUp: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onClose}
      placement="center"
      css={{
        padding: "1.5rem", // Отступы внутри модального окна
      }}
    >
      <ModalContent>
        {() => (
          <>
            {/* Заголовок модального окна */}
            <ModalHeader className="flex flex-col gap-1">
              Удаление проекта
            </ModalHeader>

            {/* Тело модального окна */}
            <ModalBody>
              <p>Вы уверены, что хотите удалить этот проект?</p>
            </ModalBody>

            {/* Футер с кнопками */}
            <ModalFooter
              css={{
                display: "flex",
                justifyContent: "flex-end",
                gap: "1.5rem", // Отступ между кнопками
              }}
            >
              <Button
                css={{
                  backgroundColor: "#FFFFFF", // Цвет фона
                  color: "#2E2E2E", // Цвет текста
                  border: "1px solid #E4E4E7", // Цвет обводки
                  "&:hover": {
                    backgroundColor: "#FFFFFF", // Цвет фона при наведении
                  },
                }}
                onPress={onClose}
              >
                Отмена
              </Button>
              <Button color="error" onPress={onClose}>
                Удалить
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default PopUp;
