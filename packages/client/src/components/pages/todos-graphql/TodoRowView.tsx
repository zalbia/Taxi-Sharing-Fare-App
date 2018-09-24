import Checkbox from "@material-ui/core/Checkbox";
import IconButton from "@material-ui/core/IconButton";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import ApolloClient from "apollo-client/ApolloClient";
import { EditableTableClassKey } from "pangwarta-shared/dist/lib";
import * as React from "react";
import { ApolloConsumer } from "react-apollo";
import { Todos_todos_nodes } from "./@types/Todos";
import queries from "./queries";

interface TodoRowViewProps {
  classes: Record<EditableTableClassKey, string>;
  onEditClick: React.ReactEventHandler;
  onDeleteClick: (todo: Todos_todos_nodes) => React.ReactEventHandler;
  elem: Todos_todos_nodes;
}

interface TodoRowViewState {
  completed: boolean;
}

export default class TodoRowView extends React.Component<
  TodoRowViewProps,
  TodoRowViewState
> {
  state: TodoRowViewState = {
    completed: this.props.elem.completed
  };

  private handleToggleCompleted = (client: ApolloClient<any>) => () => {
    client
      .mutate({
        mutation: queries.ToggleTodoCompleted,
        variables: { id: this.props.elem.id }
      })
      .then(() => {
        this.setState({ completed: this.props.elem.completed });
      });
  };

  public render() {
    const { classes, onDeleteClick, onEditClick, elem: todo } = this.props;
    const { completed } = this.state;
    return (
      <TableRow>
        <TableCell className={classes.firstColumn}>
          <ApolloConsumer>
            {client => (
              <Checkbox
                checked={completed}
                onClick={this.handleToggleCompleted(client)}
              />
            )}
          </ApolloConsumer>
        </TableCell>
        <TableCell className={classes.secondColumn}>{todo.title}</TableCell>
        <TableCell>
          <div style={{ display: "inline-flex" }}>
            <IconButton onClick={onEditClick}>
              <EditIcon />
            </IconButton>
            <IconButton onClick={onDeleteClick(todo)}>
              <DeleteIcon />
            </IconButton>
          </div>
        </TableCell>
      </TableRow>
    );
  }
}
