'use client';
import React from 'react';
import {
  TextField,
  Button,
  Typography,
  Checkbox,
  List,
  ListItem,
  Container,
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import { useState } from 'react';
import Link from 'next/link';
import { Todo } from './types';
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

export default function Index() {
  const [inputVal, setInputVal] = useState('');
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isEdited, setIsEdited] = useState(false);
  const [editedId, setEditedId] = useState<number | null>(null);
  const classes = useStyles();

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputVal(e.target.value);
  };

  const handleClick = () => {
    if (!isEdited) {
      setTodos([
        ...todos,
        {
          title: inputVal,
          completed: false,
          id: new Date().getTime(),
          userId: 1,
        },
      ]);
    } else if (editedId !== null) {
      setTodos([
        ...todos,
        { title: inputVal, completed: false, id: editedId, userId: 1 },
      ]);
    }
    setInputVal('');
    setIsEdited(false);
  };

  const onDelete = (id: any) => {
    const newTodos = todos.filter((todo: Todo) => todo.id !== id);
    setTodos(newTodos);
  };

  const handleDone = (id: any) => {
    const updated = todos.map((todo: any) => {
      if (todo.id === id) {
        todo.isDone = !todo.isDone;
      }
      return todo;
    });
    setTodos(updated);
  };

  const handleEdit = (id: any) => {
    const newTodos = todos.filter((todo: any) => todo.id !== id);
    const editVal = todos.find((todo: any) => todo.id === id);
    setEditedId(editVal?.id!);
    setInputVal(editVal?.title!);
    setTodos(newTodos);
    setIsEdited(true);
  };

  return (
    <StyledPage>
      <div className="wrapper">
        <div className="container">
          <div className="flex flex-col text-center justify-center">
            <h1 className="text-6xl py-10 font-semibold text-violet-500">
              MUI Todo{' '}
            </h1>
            <Link className="text-3xl text-purple-300" href="/todo">
              👆🏾 Goto Todo with Redux Implementation
            </Link>
            <Link className="text-3xl text-violet-600 py-5" href="/d3">
              {' '}
              D3 Visualization
            </Link>
            <div className="text-xl pt-10">👇🏾 Todo without Redux</div>
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
            <List>
              {todos.map((todo: any) => {
                return (
                  <ListItem key={todo.id} className={classes.list}>
                    <Checkbox
                      onClick={() => handleDone(todo.id)}
                      checked={todo.isDone}
                    />
                    <Typography
                      className={classes.text}
                      style={{ color: todo.isDone ? 'green' : '' }}
                      key={todo.id}
                    >
                      {todo.val}
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
  );
}
