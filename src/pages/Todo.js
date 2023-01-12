import React, { useCallback, useState, useEffect } from "react";
// React-bootstrap
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
// import {Dropdown, DropdownButton } from 'react-bootstrap;

// 1. 로그인 여부 파악
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";

import axios from "axios";
import Form from "../components/Form";
import List from "../components/List";
import Loading from "../components/Loading";
import LoadingSpinner from "../components/LoadingSpinner";

// import React : default로 내보낸 것 쓰기,  { useState } 리엑트에서 만든 메서드를 쓰겠어

/* 클래스/함수 컴포넌트(용도별로 2가지 케이스) 만드는 방법과 기능의 차이임.
내용 출력 전용, 데이터관리 용도

클래스 형식으로 제작되는 것 class : TypeScript
state 를 통해 리랜더링(Re-rendering)
Life-cycle : Mount, update, unMount...

함수 형식으로 제작되는 것 function
state 를 못쓰므로 화면 갱신이 어렵다.
useState() state 변경가능
Life-cycle을 지원 안한다.
useEffect() Life-cycle 체크가능
*/

/* 최초에 로컬에서 todoData를 읽어와서
todoData 라는 useState 를 초기화해 주어야 한다.
useState(초기값)
초기값: 로컬에서 불러서 채운다.
*/

// 로컬스토리제에 내용을 읽어온다.
// MongoDB에서 목록을 읽어온다.
// let initTodo = localStorage.getItem("todoData");

// 삼항연산자를 이용해서 초기값이 없으면
// 빈 배열 [] 로 초기화한다.
// 읽어온 데이터가 있으면 JSON.stringify() 저장한 파일을
// JSON.parse() 로 다시 객체화하여 사용한다.
// initTodo = initTodo ? JSON.parse(initTodo) : [];

const Todo = () => {
  // console.log("Todo Renderind...");

  // MongoDB 에서 초기값 읽어서 셋팅
  // axios 및 useEffect를 이용한다.
  // const [todoData, setTodoData] = useState(initTodo);
  const [todoData, setTodoData] = useState([]);
  const [todoValue, setTodoValue] = useState("");

  // 2. 로그인 상태 파악
  const navigate = useNavigate();

  const user = useSelector((state) => state.user);
  // console.log("user", user);
  useEffect(() => {
    // 사용자 로그인 여부 파악
    if (user.accessToken === "") {
      // 로그인이 안된 경우
      alert("로그인을 하셔야 합니다.");
      navigate("/login");
    } else {
      // 로그인이 된 경우
    }
  }, [user]);

  // 목록 정렬 기능
  const [sort, setSort] = useState("최신글");
  useEffect(() => {
    setSkip(0);
    getList(search, 0);
  }, [sort]);

  // 검색기능
  const [search, setSearch] = useState("");
  const searchHandler = () => {
    // 검색을 하면 목록을 불러오는것이니까 getList 호출
    setSkip(0);
    getList(search);
  };

  // axios 를 이용해서 서버에 API 호출
  // 전체 목록 호출 메서드
  const getList = (_word = "", _stIndex = 0) => {
    setSkip(0);
    setSkipToggle(true);
    // 로딩창 보여주기
    setLoading(true);

    const body = {
      sort: sort,
      search: _word,
      // 사용자 구분용도
      uid: user.uid,
      skip: _stIndex,
    };

    axios
      .post("/api/post/list", body)
      .then((response) => {
        // console.log(response.data)
        // 초기 할일 데이터 셋팅
        if (response.data.success) {
          setTodoData(response.data.initTodo);
          // 시작하는 skip 번호를 갱신한다.
          setSkip(response.data.initTodo.length);
          if (response.data.initTodo.length < 5) {
            setSkipToggle(false);
          }
        }

        // 로딩창 숨기기
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  // 더보기 버튼눌렀을 때만 실행됨.
  const getListGo = (_word = "", _stIndex = 0) => {
    // 로딩창 보여주기
    setLoading(true);

    const body = {
      sort: sort,
      search: _word,
      // 사용자 구분용도
      uid: user.uid,
      skip: _stIndex,
    };

    axios
      .post("/api/post/list", body)
      .then((response) => {
        // console.log(response.data)
        // 초기 할일 데이터 셋팅
        if (response.data.success) {
          const newArr = response.data.initTodo;
          // 배열 뜯고 합치기(쌓이고 늘어나게 되는 것),원래있던거 +들어온것
          setTodoData([...todoData, ...newArr]);
          // 시작하는 skip 번호를 갱신한다.
          setSkip(skip + newArr.length);
          // setSkip(todoData.length)
          if (newArr.length < 5) {
            setSkipToggle(false);
          }
        }
        // 로딩창 숨기기
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  //  목록 개수 출력
  const [skip, setSkip] = useState(0);
  const [skipToggle, setSkipToggle] = useState(true);

  const getListMore = () => {
    getListGo(search, skip);
  };

  useEffect(() => {
    getList("", skip);
    // 초기 데이터를 컴포넌트가 마운트 될 때 한번 실행한다. 그래서 빈 배열임.
  }, []);

  const deleteClick = useCallback(
    (id) => {
      if (window.confirm("정말 삭제하시겠습니까?")) {
        let body = {
          id: id,
        };

        axios
          .post("/api/post/delete", body)
          .then((response) => {
            // 클릭된 ID 와 다른 요소들만 걸러서 새로운 배열 생성
            const nowTodo = todoData.filter((item) => item.id !== id);
            // console.log("클릭", nowTodo)
            // 목록을 갱신한다.
            // axios를 이용해서  MongoDB를 삭제 진행
            setTodoData(nowTodo);
            console.log(response);
          })
          .catch((error) => {
            console.log(error);
          });
      }

      // 로컬에 저장한다.(DB 예정)
      // localStorage.setItem("todoData", JSON.stringify(nowTodo));
    },
    [todoData]
  );

  const addTodoSubmit = (event) => {
    // 웹 브라우저 새로고침을 하면 안되므로 막아줌.
    event.preventDefault();

    // 공백 문자열 제거 추가
    let str = todoValue;
    str = str.replace(/^\s+|\s+$/gm, "");
    if (str.length === 0) {
      alert("내용을 입력하세요.");
      setTodoValue("");
      return;
    }

    // { id: 4, title: "할일 4", completed: false },
    // todoData 는 배열이고 배열의 요소들은 위처럼 구성해야하니까
    // {}로 만들어줌.
    // 그래야 .map 을 통해서 규칙적인 jsx를 리턴할 수 있으니까.
    const addTodo = {
      id: Date.now(), // id 값은 배열.map의 key로 활용예정, unique 값 만들려고
      title: todoValue, // 할일 입력창의 내용을 추가
      completed: false, // 할일이 추가 될 때 아직 완료한 것은 아니므로 false로 초기화

      // 1. DB 저장 :  Server > Model > TodoModel Schema 업데이트(ObjectId : ID찾아서 전송하겠음.)
      uid: user.uid, // 여러명의 사용자 구분용도, 로그인하면 uid넘어옴
    };

    // 새로운 할일을 일단 복사하고 , 복사된 배열에 추가하여서 업데이트
    // 기존 할일을 Destructuring 하여서 복사본 만듦
    // todoData:[{},{},{},{},  {}] ==>  [{}]

    // axios 로 MongoDB 에  항목추가
    axios
      .post("/api/post/submit", { ...addTodo })
      .then((res) => {
        // console.log(res.data)
        if (res.data.success) {
          // setTodoData([...todoData, addTodo]);
          // 새로운 할일을 추가했으므로 내용입력창의 글자를 초기화

          setTodoValue("");
          // 로컬에 저장한다.(DB 예정)
          // localStorage.setItem("todoData", JSON.stringify([...todoData, addTodo]));

          // 목록 재호출
          setSkip(0);
          getList("", 0);

          alert("할일이 등록되었습니다.");
        } else {
          alert("할일 등록 실패하였습니다.");
        }
      })
      .catch((에러) => {
        console.log(에러);
      });
  };

  const deleteAllClick = () => {
    if (window.confirm("정말 삭제하시겠습니까?")) {
      // axios를 이용하여 MongoDB 목록 비워줌
      axios
        .post("/api/post/deleteall")
        .then(() => {
          // 목록 재호출
          // getList()
          setSkip(0);
          setTodoData([]);
        })
        .catch((error) => {
          console.log(error);
        });
    }

    // 로컬에 저장한다.(DB 예정)
    // 자료를 지운다.(DB 초기화)
    // localStorage.clear();
  };

  // 로딩창 관련
  const [loading, setLoading] = useState(false);

  return (
    <div className="flex justify-center w-full">
      <div className="w-full p-6 m-4 bg-white shadow">
        <div className="flex justify-between mb-3">
          <h1>할일 목록</h1>
          <button onClick={deleteAllClick}>Delete All</button>
        </div>

        <div className="flex justify-between mb3">
          <DropdownButton title={sort} variant="outline-secondary">
            <Dropdown.Item onClick={() => setSort("최신글")}>
              최신글
            </Dropdown.Item>
            <Dropdown.Item onClick={() => setSort("과거순")}>
              과거순
            </Dropdown.Item>
          </DropdownButton>
          <div>
            <label className="mr-2">검색어 </label>
            <input
              type="text"
              placeholder="검색어를 입력하세요."
              className="border-2"
              value={search}
              onChange={(e) => setSearch(e.currentTarget.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  searchHandler();
                }
              }}
            />
          </div>
        </div>

        <List
          todoData={todoData}
          setTodoData={setTodoData}
          deleteClick={deleteClick}
        />
        {skipToggle && (
          <div className="flex justify-end">
            <button
              className="p-2 text-black-400 border-2 border-blue-400 rounded hover:text-white hover:bg-blue-400"
              onClick={() => getListMore()}
            >
              더보기
            </button>
          </div>
        )}

        <Form
          todoValue={todoValue}
          setTodoValue={setTodoValue}
          addTodoSubmit={addTodoSubmit}
        />
      </div>
      {/* 로딩창 샘플 */}
      {loading && <LoadingSpinner />}
    </div>
  );
};

export default Todo;
