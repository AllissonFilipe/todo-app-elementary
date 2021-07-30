import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { map } from 'rxjs/operators'


@Component({
  selector: 'app-todo',
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.css']
})
export class TodoComponent implements OnInit {

  todos = [];
  todo = '';
  optionSelected = 'All'; 

  constructor(private db: AngularFireDatabase) { }

  ngOnInit() {
    this.listTodos();
  }

  listTodos() {
    this.db.list('todos').snapshotChanges().subscribe(todos => {
      this.todos = todos.map(todoFire => {
        const todo: any = todoFire.payload.val();
        return ({ key: todoFire.payload.key, checked: todo.checked, value: todo.value })
      })
    })

  }

  addTodo() {
    this.db.list('todos').push({checked: false, value: this.todo})
    .then(() => {
      this.listTodos();
    })
    this.todo = '';
  }

  toggleOption(option) {
    this.optionSelected = option;
  }

  completeTodo(event, todo) {
    todo.checked = event.target.checked;
    this.db.list('todos').update(todo.key, todo)
      .catch((error: any) => {
        console.error(error);
      });
  }

  deleteTodo(todo) {
    this.db.object(`todos/${todo.key}`).remove();
    this.todos.splice(this.todos.indexOf(todo), 1);
  }

  deleteAllTodo() {
    this.todos = this.todos.filter((todo) => {
      if(todo.checked) {
        this.db.object(`todos/${todo.key}`).remove();
      }
      return !todo.checked
    });
  }

}
