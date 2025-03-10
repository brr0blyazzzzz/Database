import psycopg2
from datetime import datetime
dbname = "registration"
user = "postgres"
password = "root"
host = "localhost"
port = "5432"

conn = psycopg2.connect(
    dbname=dbname,
    user=user,
    password=password,
    host=host,
    port=port
)
cursor = conn.cursor()

while True:
    print("1. Регистрация пользователя")
    print("2. Вывести всех зарегистрированных пользователей")
    print("3. Выход")
    choice = input("Выберите действие: ")

    if choice == '1':
        login = input("Введите логин, состоящий минимум из 6 символов, содержащий буквы или цифры и не содержащий "
                      "пробелы: ")
        password = input("Введите пароль, состоящий минимум из 6 символов, содержащий заглавную и строчную букву, "
                         "цифру, специальный символ, не содержащий пробелы: ")
        family = input("Введите фамилию: ")
        name = input("Введите имя: ")
        patronymic = input("Введите отчествo(оставьте пустым если нет): ")
        birth_date = input("Введите дату рождения (YYYY-MM-DD): ")
        try:
            valid_date = datetime.strptime(birth_date, '%Y-%m-%d')
        except ValueError:
            print("Неверный формат даты. Пожалуйста, введите дату в формате YYYY-MM-DD.")
        try:
            cursor.execute("CALL register_user(%s, %s, %s, %s, %s, %s)",(login, password, family, name, patronymic, birth_date))
            conn.commit()
            print("Пользователь успешно зарегистрирован.")

        except Exception as e:
            print(e)
            conn.rollback()


    elif choice == '2':
        try:
            cursor.execute("""SELECT u.login, u.registration_date, a.name, a.family, a.patronymic FROM public.users AS u JOIN public.accounts AS a ON u.id = a.user_id""")
            users_accounts = cursor.fetchall()
            if not users_accounts:
                print("Нет зарегистрированных пользователей")
            else:
                print("Зарегистрированные пользователи и аккаунты:")
                print(f'{"Логин":<50} {"Время регистрации":<25} {"Имя":<25} {"Фамилия":<30} {"Отчество":<25}')
                for record in users_accounts:
                    login = record[0]
                    registration_time = record[1].strftime('%Y-%m-%d %H:%M:%S')
                    name = record[2]
                    family = record[3]
                    patronymic = record[4] if record[4] else "Не указано"
                    print(f'{login:<50} {registration_time:<25} {name:<25} {family:<30} {patronymic:<25}')
        except Exception as e:
            print(f"Ошибка при получении пользователей: {e}")
            conn.rollback()

    elif choice == '3':
        break
    else:
        print("Неверный выбор. Пожалуйста, попробуйте снова.")
cursor.close()
conn.close()
