> **Note:** The new [React Hooks API Proposal](https://reactjs.org/docs/hooks-intro.html)
> is subject to change until React 16.7 final.
>
> You'll need to install `react`, `react-dom`, etc at `^16.7.0-alpha.0`

## Motivation

Hooks provide an even more declarative way to structure your component data. The boilerplate state mapping functions will look even more out of place.

Hooks provide a great place for Rematch's abstractions to have meaning in react:

```
function TodoList(props){
  const [todos, people] = useModels('todos', 'people')

  return (
    <ul>
      ...
    </ul>
  )
}
```

Hooks also bring with them a more obvious side-effect system that can keep redux out of your component lifecycle:

```
function TodoList(props){
  useReduxEffect(dispatch => dispatch.todos.loadTodos(props.startDate), [props.startDate])
  ...
}
```
