# Techmatize - API

## Como rodar instância local do RabbitMQ
```shell
$ docker pull rabbitmq:3-management
$ docker run -d -p 5672:5672 -p 15672:15672 --name rabbitmq rabbitmq:3-management
```

Com essa configuração, o RabbitMQ irá rodar na porta 5672 e o painel de admin irá rodar na porta 15672

## Filas
Cada licença ativa terá uma fila, com o padrão de nomenclatura `license.{id}`. As filas serão criadas e apagadas automaticamente nos métodos de create, update e delete, bem como em um scheduler que verifica periodicamente quais licenças expiraram.

Os robôs irão consumir das filas `license.{id}`, e após terminarem as tarefas, devem mandar a resposta na fila `robot.response` com uma string JSON no seguinte formato:

```json
{
  "id": "id da tarefa",
  "status": "finished | failed",
  "result": {}
}
```

O objeto de result poderá ser qualquer objeto JSON, e deverá conter os detalhes que o administrador queira guardar na tarefa após a sua conclusão ou falha.
