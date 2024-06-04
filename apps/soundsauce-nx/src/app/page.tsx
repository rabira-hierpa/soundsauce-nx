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
  const [charts] = useState([
    {
      title: 'Noise Chart',
      path: '/d3/noise',
    },
    {
      title: 'Period Chart',
      path: '/d3/period',
    },
    {
      title: 'Sample Large Charts',
      path: '/d3/sample',
    },
    {
      title:'Chart Js',
      path: '/chartjs'
    }
  ]);
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
        <div className="px-20">
          <div className="flex flex-col text-center justify-center">
            <h1 className="text-6xl py-10 font-semibold text-violet-500">
             D3 and Chart.js Prototypes{' '}
            </h1>
            <div className="flex space-x-5 justify-center py-5">
              {charts.map((chart) => (
                <Link
                  key={chart.title}
                  href={chart.path}
                  className="text-xl text-yellow-500 hover:cursor-pointer "
                >
                  {chart.title}
                </Link>
              ))}
            </div>
          </div>
         </div>
      </div>
    </StyledPage>
  );
}
