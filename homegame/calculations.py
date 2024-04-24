def convert_to_name(name):
    return name[0].upper() + name[1:]

def names_as_one_string(names):
    string = ""
    for name in names[:-1]:
        string += name + ", "
    string = string[:-2]
    string += " and " + names[-1]
    return string

def settle_balance(balance: dict):
    sorted_balance = sorted(balance.items(), key=lambda player: player[1])
    print(sorted_balance)
    transactions = []
    player = sorted_balance[0]
    total = sum(balance.values())
    while player[1] < 0:
        other_player = sorted_balance[-1]
        print(player[1], other_player[1])
        if -player[1] == other_player[1]:
            amount = '€' + str(round(-player[1], 2)) if round(-player[1], 2) >= 0 else '-€' + str(-round(-player[1], 2))
            transactions.append(
                f"{player[0]} pays {amount} to {other_player[0]}"
            )
            sorted_balance = sorted_balance[1:-1]
        elif -player[1] < other_player[1]:
            amount = '€' + str(round(-player[1], 2)) if round(-player[1], 2) >= 0 else '-€' + str(-round(-player[1], 2))
            transactions.append(
                f"{player[0]} pays {amount} to {other_player[0]}"
            )
            sorted_balance = sorted_balance[1:]
            sorted_balance[-1] = (other_player[0], other_player[1] + player[1])
        else:
            amount = '€' + str(round(other_player[1], 2)) if round(other_player[1], 2) >= 0 else '-€' + str(-round(other_player[1], 2))
            transactions.append(
                f"{player[0]} pays {amount} to {other_player[0]}"
            )
            print(sorted_balance[:-1])
            sorted_balance = sorted_balance[:-1]
            player = (player[0], player[1] + other_player[1])
        if len(sorted_balance) <= 1:
            break
        player = sorted_balance[0]
        print(sorted_balance)
    amount = amount = '€' + str(round(total, 2)) if round(total, 2) >= 0 else '-€' + str(-round(total, 2))
    transactions.append(f"Amount not accounted for: {amount}")
    for transation in transactions:
        print(transation)
    return transactions
