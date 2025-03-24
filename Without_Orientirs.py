import psycopg2

dbname = "postgres"
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


def get_positive_int_input(prompt):
    while True:
        value = input(prompt).strip()
        if not value:
            print("Значение не должно быть пустым.")
        elif not value.isdigit() or int(value) <= 0:
            print("Введите целое положительное число.")
        else:
            return int(value)


def print_user_tags_with_titles(user_id):
    cursor.execute("SELECT tags FROM public.accounts WHERE id = %s;", (user_id,))
    result = cursor.fetchone()
    if result and result[0]:
        tags = result[0]
        tags_ids = ','.join(map(str, tags))
        cursor.execute(f"SELECT id, title FROM public.tags WHERE id IN ({tags_ids});")
        tag_titles = cursor.fetchall()
        tags_dict = {tag[0]: tag[1] for tag in tag_titles}
        tags_output = ' '.join(f"({tag_id}){tags_dict[tag_id]}" for tag_id in tags)
        print(f"Теги для аккаунта с user_id {user_id}: {tags_output}; ")
    else:
        print("Для данного пользователя нет тегов.")


def check_user_exists(user_id):
    cursor.execute("SELECT EXISTS(SELECT 1 FROM public.accounts WHERE id = %s);", (user_id,))
    exists = cursor.fetchone()[0]
    if not exists:
        print(f"Пользователь с ID {user_id} не существует.")
    return exists

def check_tag_exists(tag_id):
    cursor.execute("SELECT EXISTS(SELECT 1 FROM public.tags WHERE id = %s);", (tag_id,))
    exists = cursor.fetchone()[0]
    if not exists:
        print(f"Тег с ID {tag_id} не существует.")
    return exists

def check_tag_exists_for_user(user_id, tag_id):
    cursor.execute("SELECT EXISTS (SELECT 1 FROM public.accounts WHERE id = %s AND %s = ANY(tags));", (user_id, tag_id))
    exists = cursor.fetchone()[0]
    return exists


def add_tag_to_account(user_id, tag_id):
    try:
        cursor.execute("UPDATE public.accounts SET tags = array_append(tags, %s) WHERE id = %s;", (tag_id, user_id))
        conn.commit()
        print(f"Тег с ID {tag_id} успешно добавлен к аккаунту с user_id {user_id}.")
    except Exception as e:
        print(f"Ошибка при добавлении тега: {e}")
        conn.rollback()


def remove_tag_from_account(user_id, tag_id):
    try:
        cursor.execute("UPDATE public.accounts SET tags = array_remove(tags, %s) WHERE id = %s;", (tag_id, user_id))
        conn.commit()
        print(f"Тег с ID {tag_id} успешно удалён из аккаунта с user_id {user_id}.")
    except Exception as e:
        print(f"Ошибка при удалении тега: {e}")
        conn.rollback()


def delete_tag(tag_id):
    try:
        cursor.execute("DELETE FROM public.tags WHERE id = %s;", (tag_id,))
        cursor.execute("UPDATE public.accounts SET tags = array_remove(tags, %s) WHERE %s = ANY(tags);", (tag_id, tag_id))
        conn.commit()
        print(f"Тег с ID {tag_id} успешно удалён.")
    except Exception as e:
        print(f"Ошибка при удалении тега: {e}")
        conn.rollback()


def list_all_accounts():
    try:
        cursor.execute("""SELECT a.id, a.family, a.name, a.patronymic, a.tags FROM public.accounts a ORDER BY a.id;""")
        accounts = cursor.fetchall()
        if accounts:
            print("\nСписок всех аккаунтов:")
            for account in accounts:
                user_id = account[0]
                family = account[1]
                name = account[2]
                patronymic = account[3] if account[3] else 'None'
                tags = account[4] if account[4] else []
                tags_titles = []
                if tags:
                    tags_ids = ','.join(map(str, tags))
                    cursor.execute(f"""SELECT title FROM public.tags WHERE id IN ({tags_ids});""")
                    tag_titles = cursor.fetchall()
                    tags_titles = [tag[0] for tag in tag_titles]
                tags_str = ', '.join(tags_titles)
                print(f"Id: {user_id:<5} Фамилия: {family:<15} Имя: {name:<15} Отчество: {patronymic:<15} Теги: {tags_str}")
        else:
            print("Нет аккаунтов.")
        cursor.execute("""SELECT id, title FROM public.tags;""")
        tags = cursor.fetchall()

        if tags:
            print("\nСписок всех тегов:")
            for tag in tags:
                tag_id = tag[0]
                title = tag[1]
                print(f"Id: {tag_id:<5} Название: {title}")
        else:
            print("Нет тегов.")
    except Exception as e:
        print(f"Ошибка при выводе аккаунтов или тегов: {e}")


while True:
    print("\n1. Добавить тег к аккаунту")
    print("2. Удалить тег с аккаунта")
    print("3. Удалить тег")
    print("4. Вывод всех тегов и пользователей")
    print("5. Выход")
    choice = input("Выберите действие: ").strip()

    if choice == '1':
        user_id = get_positive_int_input("Введите user_id аккаунта: ")
        if check_user_exists(user_id):
            print_user_tags_with_titles(user_id)
            tag_id = get_positive_int_input("Введите id тега: ")
            if check_tag_exists(tag_id):
                if not check_tag_exists_for_user(user_id, tag_id):
                    add_tag_to_account(user_id, tag_id)
                else:
                    print(f"Тег c ID {tag_id} у пользователя с user_id {user_id} уже существует.")


    elif choice == '2':
        user_id = get_positive_int_input("Введите user_id аккаунта: ")
        if check_user_exists(user_id):
            print_user_tags_with_titles(user_id)
            tag_id = get_positive_int_input("Введите id тега для удаления: ")
            if check_tag_exists_for_user(user_id,tag_id):
                remove_tag_from_account(user_id, tag_id)
            else:
                print("Такого тега у пользователя нет.")
                continue
        else:
            print(f"Аккаунт с user_id {user_id} не найден.")
    elif choice == '3':
        tag_id = get_positive_int_input("Введите id тега: ")
        if check_tag_exists(tag_id):
            delete_tag(tag_id)

    elif choice == '4':
        list_all_accounts()

    elif choice == '5':
        break

    else:
        print("Неверный выбор. Пожалуйста, попробуйте снова.")

cursor.close()
conn.close()