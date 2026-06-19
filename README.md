# How run
 - sudo apt update
 - sudo apt install build-essential python3 make g++
 - npm install sqlite3 --build-from-source
 - npm install

# API Sequelize para controle de folga

Esta API tem como objetivo realizar o controle de folgas de funcionários em uma loja. Há dois tipos de usuário: O Empregador e o Funcionário. O Empregador possui liberdade para criar vários perfis de Funcionários, atribuir dias de folgas para funcionários e ver todos os dias de folgas dos seus funcionários e as folgas requisitadas.

Já os funcionários podem requisitar uma folga para o empregador e ver todas as suas folgas. 

Os dois usuários podem se autenticar, recebendo um Json Web Tolken como token de autenticação.

A base de dados utilizada é uma base SQL LITE.
