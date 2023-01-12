import React from "react";
import ListItem from "./ListItem";
import { useSelector } from "react-redux";

const List = React.memo(({ todoData, setTodoData, deleteClick }) => {
  console.log("List Rendering...");
  // 함수 컴포넌트에서는 변수나 메서드는 const 나 let을 작성해야해

  const user = useSelector((state) => state.user);
  return (
    <div>
      {todoData.map(
        // 로컬에 있는 유저를 가져와야함.
        (item) =>
          item.author.uid === user.uid && (
            <div key={item.id}>
              <ListItem
                item={item}
                todoData={todoData}
                setTodoData={setTodoData}
                deleteClick={deleteClick}
              />
            </div>
          )
      )}
    </div>
  );
});

export default List;
