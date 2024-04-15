'use client';
import React, { useEffect } from 'react';
import {
  TextField,
  Button,
  Typography,
  Checkbox,
  List,
  ListItem,
  Container,
  makeStyles,
} from '@material-ui/core';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import StoreProvider from '../GlobalRedux/StoreProvider';

const StyledPage = ({ children }: { children: React.ReactNode }) => (
  <div>{children}</div>
);

const useStyles = makeStyles({
  input: {
    width: '70%',
    marginBottom: 30,
  },
  addButton: {
    height: 55,
    marginBottom: 30,
  },
  container: {
    textAlign: 'center',
    marginTop: 100,
  },
  list: {
    width: '80%',
    margin: 'auto',
    display: 'flex',
    justifyContent: 'space-around',
    border: '1px solid light-gray',
  },
  text: {
    width: '70%',
  },
  listButtons: {
    marginLeft: 10,
  },
});

export default function Todo() {
  const [inputVal, setInputVal] = useState('');
  const [todos, setTodos] = useState<any>([]);
  const [loading, setLoading] = useState(true);
  const [isEdited, setIsEdited] = useState(false);
  const [editedId, setEditedId] = useState(null);
  const classes = useStyles();
  const allTodos = useSelector((state: any) => state.todos);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputVal(e.target.value);
  };

  const handleClick = () => {
    if (!isEdited) {
      setTodos([
        ...todos,
        { title: inputVal, completed: false, id: new Date().getTime() },
      ]);
    } else {
      setTodos([...todos, { title: inputVal, completed: false, id: editedId }]);
    }
    setInputVal('');
    setIsEdited(false);
  };

  const onDelete = (id: any) => {
    const newTodos = todos.filter((todo: Todo) => todo.id !== id);
    setTodos(newTodos);
  };

  const handleDone = (id: any) => {
    const updated = todos.map((todo: Todo) => {
      if (todo.id === id) {
        todo.completed = !todo.completed;
      }
      return todo;
    });
    setTodos(updated);
  };

  const handleEdit = (id: any) => {
    const newTodos = todos.filter((todo: Todo) => todo.id !== id);
    const editVal = todos.find((todo: Todo) => todo.id === id);
    setEditedId(editVal.id);
    setInputVal(editVal.title);
    setTodos(newTodos);
    setIsEdited(true);
  };

  useEffect(() => {
    fetch('/api/todos')
      .then((res) => {
        return res.json();
      })
      .then((data: any) => {
        setTodos(data.slice(0, 10));
      })
      .catch((err) => console.log(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <StoreProvider>
      <StyledPage>
        <div className="wrapper">
          <div className="container">
            <div className="flex justify-center">
              <h1 className="text-6xl py-10 font-semibold text-violet-500">
                Redux Toolkit{' '}
              </h1>
            </div>
            <Container component="main" className={classes.container}>
              <TextField
                variant="outlined"
                onChange={onChange}
                label="Title"
                value={inputVal}
                className={classes.input}
              />
              <Button
                size="large"
                variant={isEdited ? 'outlined' : 'contained'}
                color="primary"
                onClick={handleClick}
                className={classes.addButton}
                disabled={inputVal ? false : true}
              >
                {isEdited ? 'Edit Task' : 'Add Task'}
              </Button>
              <div className="flex justify-center py-10 ">
                {loading && <div>Loading...</div>}
              </div>
              <List>
                {todos?.map((todo: Todo) => {
                  return (
                    <ListItem key={todo.id} className={classes.list}>
                      <Checkbox
                        onClick={() => handleDone(todo.id)}
                        checked={todo.completed}
                      />
                      <Typography
                        className={classes.text}
                        style={{ color: todo.completed ? 'green' : '' }}
                        key={todo.id}
                      >
                        {todo.title}
                      </Typography>
                      <Button
                        onClick={() => handleEdit(todo.id)}
                        variant="contained"
                        className={classes.listButtons}
                      >
                        Edit
                      </Button>
                      <Button
                        onClick={() => onDelete(todo.id)}
                        color="secondary"
                        variant="contained"
                        className={classes.listButtons}
                      >
                        delete
                      </Button>
                    </ListItem>
                  );
                })}
              </List>
            </Container>
          </div>
        </div>
      </StyledPage>
    </StoreProvider>
  );
}
