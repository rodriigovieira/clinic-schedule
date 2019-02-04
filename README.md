# Clinic Schedule

This is an application made to manage the schedule of a clinic, by using RESTFULL operations with NodeJS.

### POST /create/:type

Essa solicitação à API serve para gerenciar os horários no banco de dados. Essa oopção disponibiliza três tipos de solicitação. Por padrão, a opção que será escolhida será a número 1.

Se o parâmetro `:type` não for informado, será utilizado a opção 1 como padrão.

##### POST /create/1

No tipo 1, você estará criando uma regra em um dia específico. Portanto, você deve informar a data na solicitação POST no body da request, em JSON, através da propriedade "day".

Por exemplo:

```
{
  "day": "2018-03-03", // o dia em que a entrada será criada
  "start": "16:00", // a hora em que a consulta se iniciará
  "end": "16:30", // a hora em que a consulta finalizará
  free: false // se o horário informado está disponível ou não. True para disponível, false para ocupado.
}
```

Por padrão, nessa regra de criação a propriedade `free` será definido como `false`. Ou seja, o horário não estará disponível, e se alguém tentar criar uma nova entrada com esse horário em qualquer regra, receberá um erro informando que o horário em questão já está ocupado.

##### POST /create/2

Nessa solicitação, será criada uma regra diária para todos os dias até o último dia do mês atual. Nessa regra, você pode informar um horário de começo e de fim, informando ao banco de dados que tal intervalo está disponível.

Por exemplo: supondo que hoje seja 04 de fevereiro de 2019, se você fizer a seguinte solicitação:

```
{
  "start": "14:30", // horário em que a consulta se inicia
  "end": "15:00" // horário em que a consulta será finalizada
}
```

Você criará no banco de dados uma entrada com o intervalo acima para todos os dias do mês, até o último dia do mês em questão.

Ou seja, você liberará esse intervalo do dia 05 de fevereiro de 2019 até o dia 28 de fevereiro de 2019.

Por padrão, a propriedade `free` é definida como `true`. Ou seja, os horários informados estarão disponíveis e poderão ser agendados. Como sempre, você pode personalizar a solicitação e informar que todos os horários estão ocupados, por exemplo. Basta adicionar à solicitação `"free": false`.

Você também pode escolher em que mês as regras informadas serão criadas. Por padrão, o mês atual é selecionado, mas você pode definir em que mês deseja criar os intervalos através da propriedade `month`. 1 para janeiro, 12 para dezembro.

##### POST /create/3

Com essa última solicitação você pode criar uma regra semanal, que criará o intervalo informado nos dias que você informar.

Você deve informar os dias da semana que você deseja através da propriedade `weekDays'. 1 significa segunda-feira, enquanto 7 significa domingo. Se você deseja passar mais de um dia, basta apenas separar por vírgula o código dos dias que você deseja informar.

Por exemplo:

```
{
  "weekDays": '1, 2, 3, 4, 5', // código dos dias da semana que deseja criar a regra. Semana começa com segunda.
  "start": '13:30",
  "end": "14:00",
  "weeks": 4, // número de semanas que deseja aplicar essa regra
  "free": true // por padrão, nessa regra, os horários informados serão definidos como livre.
}
```

As propriedades `weekDays` e `free` são opcionais. Se não forem informadas, serão passados os valores '1, 2, 3, 4, 5' e `true`, respectivamente. Ou seja, o intervalo informado será criado em todos os dias de segunda a sexta das próximas quatro semanas.

Por padrão, a regra acima funcionará para as próximas 4 semanas, mas você pode selecionar o número de semanas que deseja aplicar a regra alterando a propriedade `weeks` para o número de semanas desejado.

### GET /all

Essa solicitação é a mais simples. Retornará todos os horários criados no banco de dados, inclusive informando se o horário informado está disponível ou não, através da propriedade `free`.
