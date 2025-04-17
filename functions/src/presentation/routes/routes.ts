import {Router as router} from "express";
import {TaskController} from "../controllers/task.controller";
import {UserController} from "../controllers/user.controller";


import {FirestoreTaskRepository} from
  "@infrastructure/repositories/firestore-task.repository";
import {FirestoreUserRepository} from
  "@infrastructure/repositories/firestore-user.repository";

import {CreateTaskUseCase} from
  "@application/use-cases/task/create-task.usecase";
import {GetTasksUseCase} from "@application/use-cases/task/get-tasks.usecase";
import {UpdateTaskUseCase} from
  "@application/use-cases/task/update-task.usecase";
import {DeleteTaskUseCase} from
  "@application/use-cases/task/delete-task.usecase";
import {FindUserUseCase} from "@application/use-cases/user/find-user.usecase";
import {CreateUserUseCase} from
  "@application/use-cases/user/create-user.usecase";
import {createAuthMiddleware} from
  "@presentation/middlewares/authentication.middleware";
import {validate, ValidationSchemas} from
  "@presentation/middlewares/validation.middleware";

export const routes = router();

const taskRepository = new FirestoreTaskRepository();
const userRepository = new FirestoreUserRepository();

const createTaskUseCase = new CreateTaskUseCase(taskRepository);
const getTasksUseCase = new GetTasksUseCase(taskRepository);
const updateTaskUseCase = new UpdateTaskUseCase(taskRepository);
const deleteTaskUseCase = new DeleteTaskUseCase(taskRepository);
const findUserUseCase = new FindUserUseCase(userRepository);
const createUserUseCase = new CreateUserUseCase(userRepository);

const taskController = new TaskController(
  createTaskUseCase,
  getTasksUseCase,
  updateTaskUseCase,
  deleteTaskUseCase
);

const userController = new UserController(
  findUserUseCase,
  createUserUseCase
);

const auth = createAuthMiddleware(findUserUseCase);


routes.get("/users/:email",
  (req, res) => userController.findUserByEmail(req, res)
);

routes.post("/users",
  validate(ValidationSchemas.createUser),
  (req, res) => userController.createUser(req, res)
);

routes.get("/tasks",
  auth.required,
  (req, res) => taskController.getTasks(req, res)
);

routes.get("/tasks/:id",
  auth.required,
  (req, res) => taskController.getTaskById(req, res)
);

routes.post("/tasks",
  auth.required,
  validate(ValidationSchemas.createTask),
  (req, res) => taskController.createTask(req, res)
);

routes.put("/tasks/:id",
  auth.required,
  validate(ValidationSchemas.updateTask),
  (req, res) => taskController.updateTask(req, res)
);

routes.delete("/tasks/:id",
  auth.required,
  (req, res) => taskController.deleteTask(req, res)
);

routes.get("/health", (req, res) => {
  res.status(200).json({status: "OK", timestamp: new Date().toISOString()});
});
