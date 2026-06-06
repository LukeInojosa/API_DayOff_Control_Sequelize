# Criar um Employer:
{
    "usename":,
    "password":,
    "cnpj":,
    "companyName":,
    "role":"employer"
}

# Criar um Employee:
Ou o cnpj ou o companyName podem ser utilizados para 
indicar a empresa da qual o funcionário faz parte.
{
    "username":,
    "password":,
    "cpf":,
    "name":,
    "cnpj":,
    "companyName":,
    "role":"employee"
}

# Deleta Employer
{
    "username":,
    "password":,
    "role": "employer"
}

# Deleta Employee
Apenas o empregador pode deletar um empregado. para deletar é preciso
o cpf ou o username do empregado e o empregador precisa se autenticar

{
    "cpf":,
    "username":,
    "role": "employee"
    "employerAutentication": {
        "username":,
        "password":
    }
}