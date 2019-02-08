# Clinic Schedule

Essa é uma aplicação feita para facilitar o gerenciamento de horários de uma empresa, permitindo o gerenciamento de disponibilidade e dispondo de várias opções para criação de horários.

O aplicativo pode ser visualizado nesse link: https://schedule-manager.rodrigovieira.work. Caso prefira, as próprias solicitações para a API podem ser efetuadas para esse mesmo link. Todavia, caso você deseje instalar o programa localmente, segue os passos abaixo.

# Instalação

Para instalar o aplicativo, primeiro tenha certeza que você possui Node instalado localmente. Também é preciso que você possua o MongoDB instalado e iniciado localmente.

Após isso, clone o repositório usando git. Execute em seu shell:

```
git clone https://github.com/rodriigovieira/schedule-manager.git
```

Depois, altere para o diretório do projeto usando cd e instale todas as dependências dele usando yarn. Execute:

```
cd schedule-manager && yarn install
```

Pronto! O projeto está instalado em sua máquina. Na próxima seção, estão as instruções de como utilizá-lo.

# Utilização

O projeto conta com dois comandos: `start` e `test`. O primeiro iniciará o projeto, enquanto o segundo rodará uma sequência de testes para verificar se as funcionalidades estão sendo executadas conforme planejado.

Para iniciar o projeto, execute:

```
yarn start
```

Por padrão, o projeto será executado na porta 3000. Você pode alterar a porta no arquivo src/app.js ou mudando a variável de ambiente PORT.

Para poder usar o aplicativo, você precisa de um cliente para efetuar solicitações API. Um muito popular é o Postman. A documentação da API está disponível abaixo e você pode verifiar todas as opções e funcionalidades disponíveis.

# Documentação

O projeto conta com os seguintes endpoits: 

```
- POST /create - cria horários no banco de dados. Aceita três opções diferentes.
- GET /all - lista todos os horários disponíveis no banco de dados, inclusive se estão disponíveis ou não.
- POST /list - mostra todos os horários disponíveis de dia X até dia Y.
- DELETE /delete - deleta horários no banco de dados. Aceita três opções diferentes.
```

**Importante:** as solicitações devem ser feitas com o seguinte padrão: 'DD-MM-YYYY'. Por exemplo: '01-04-2019'.

### POST /create/:type

Essa solicitação à API serve para gerenciar os horários no banco de dados. Essa oopção disponibiliza três tipos de solicitação.

Se o parâmetro `:type` não for informado, será utilizado a opção 1 como padrão.

##### POST /create/1 (padrão)

No tipo 1, você estará criando uma regra em um dia específico. Portanto, você deve informar a data na solicitação POST no body da request, em JSON, através da propriedade "day".

Por exemplo:

```
{
  "day": "2018-03-03", // o dia em que a entrada será criada (padrão: dia atual)
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

As propriedades `weekDays` e `free` são opcionais. Se não forem informadas, serão passados os valores '1, 2, 3, 4, 5' e `false`, respectivamente. Ou seja, o intervalo informado será criado em todos os dias de segunda a sexta das próximas quatro semanas e os horários NÃO estarão disponíveis.

A regra acima funcionará para as próximas 4 semanas, mas você pode selecionar o número de semanas que deseja aplicar a regra alterando a propriedade `weeks` para o número de semanas desejadas.

### GET /all

Essa solicitação é a mais simples. Retornará todos os horários criados no banco de dados, inclusive informando se o horário informado está disponível ou não, através da propriedade `free`.

### POST /list

Nesse endpoint, você pode efetuar uma solicitação do tipo POST para receber uma lista com todos os intervalos disponíveis nas datas selecionadas. Você selecionará as datas com as propriedads `startDate` e `endDate`.

Exemplo de solicitação:
```
{
  "startDate": "01-05-2019", // data inicial do intervalo de datas
  "endDate": "01-07-2019" // última data do intervalo
}
```

A solicitação acima retornará todos os horários entre as datas informadas.

### DELETE /delete/:type

Essa regra é bastante similar à regra de criação. Nessa, por padrão, o `type` 1 é passado. Ou seja, se o parâmetro `:type` não for informado no URL, será utilizado por padrão o 1.

Essa regra serve para deletar um intervalo do banco de dados. A solicitação pode ser feita seguindo o mesmo padrão de criação: dia específico, regra diária ou regra semanal.

##### DELETE /delete/1

Nessa, você deletará um intervalo específico de um dia específico. Portanto, é necessário informar a propriedade `day` na solicitação. Se a propriedade `day` não for especificada, será utilizado por padrão o dia atual.

Exemplo de solicitação:

```
{
  "day": "10-09-2019", // OPCIONAL: dia que terá o intervalo deletado
  "start": "14:00", // começø do intervalo
  "end": "14:30" // fim do intervalo
}
```

##### DELETE /delete/2

Se o segundo tipo for utilizado, todos os dias do mês serão selecionados. Ou seja, você apagará o intervalo informado em todos os dias do mês que você informar.

Se nenhum mês for informado, será utilizado por padrão o mês atual.

Exemplo de solicitação:

```
{
  "month": 7, // OPCIONAL: número do mês que terá o intervalo apagado. Nesse exemplo, julho.
  "start": "13:30", // começo do intervalo
  "end": "14:00" // fim do intervalo
}
```

##### DELETE /delete/3

Por último, você pode deletar um intervalo com base nos dias da semana. Você pode escolher deletar somente o intervalo selecionado em todas as segundas-feiras.

Essa solicitação aceita a propriedade `weeks` (padrão: 4) e `weekDays` (padrão: '1, 2, 3, 4, 5').

Exemplo:

```
{
  "weeks": 8, // a regra será aplicada para até 8 semanas (56 dias) a contar do dia atual
  "weekDays": '1, 3', // a regra só será aplicada às segundas-feiras e quartas-feiras
  "start": "18:00", // começo do intervalo
  "end": "18:30" // fim do intervalo
}
```

# Conclusão

Se desejar, é possível também executar o comando `yarn test` que mostratá um resumo de todas as funções do aplicativo.

Em alguns casos, a regra de validação de cadastro já está configurada. Se você receber algum erro durante a criação de horários, é porque o horário já está ocupado.
