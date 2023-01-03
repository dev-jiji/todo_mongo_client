import React from "react";
import ListItem from "./ListItem";


const List = React.memo( ({todoData, setTodoData, deleteClick}) => {
  // console.log("List Renderind...");
    // 함수 컴포넌트에서는 변수나 메서드는 const 나 let을 작성해야해

    
    
      
  return (
    <div>
      {todoData.map((item) => (
        <div key={item.id}>
          <ListItem  
          item={item}
          todoData={todoData} 
          setTodoData={setTodoData} 
          deleteClick={deleteClick}
          />
      </div>
      ))}
    </div>
  );
});

export default List;
