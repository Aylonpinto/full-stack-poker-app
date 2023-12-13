def convert_to_name(name):
    return name[0].upper() + name[1:]


def names_as_one_string(names):
    string = ""
    for name in names[:-1]:
        string += name + ", "
    string = string[:-2]
    string += " and " + names[-1]
    return string


def get_players():
    print("How many players?")
    number_of_players = int(input())
    print(f"What are the names of the {number_of_players} players?")
    names_of_the_players = []
    for index in range(number_of_players):
        print(f"Name player {index +1}:")
        player_name = convert_to_name(input())
        names_of_the_players.append(player_name)
    print(f"Great! thank you {names_as_one_string(names_of_the_players)}")
    return names_of_the_players


def get_in_for(names):
    print("How much are you in for?")
    players_in_for = {}
    total = 0
    for name in names:
        print(f"How much is {name} in for?")
        in_for = float(input())
        total += in_for
        players_in_for[name] = in_for
    return players_in_for, total


def get_end_balance(names):
    print("How much did you end up with?")
    players_end_balance = {}
    total = 0
    for name in names:
        print(f"How much did {name} end up with?")
        end_balans = float(input())
        total += end_balans
        players_end_balance[name] = end_balans
    return players_end_balance, total


class Game:
    def __init__(self, in_for: dict, end_balance: dict) -> None:
        self.balance = {}
        for name in end_balance:
            self.balance[name] = round(end_balance[name] - in_for[name], 2)

    def __str__(self) -> str:
        return str(self.balance)


class PokerBalance:
    def __init__(self) -> None:
        self.games = []
        self.balance = {}
        self.insert_game()

    def __str__(self) -> str:
        return str(self.balance)

    def insert_game(self):
        names_of_the_players = get_players()
        in_for, total_in = get_in_for(names_of_the_players)
        end_balance, total_out = get_end_balance(names_of_the_players)
        if total_in != total_out:
            print("The total ammount people are in for does not match the end balans.")
            print(f"The total in is {total_in} and the total out is {total_out}.")
            print(
                f"Please enter the name of the player to deduct {total_out - total_in} from:"
            )
            player = convert_to_name(input())
            end_balance[player] = end_balance[player] - total_out + total_in
        game = Game(in_for, end_balance)
        self.games.append(game)
        for player, value in game.balance.items():
            try:
                self.balance[player] = self.balance[player] + value
            except KeyError:
                self.balance[player] = value
        return game

    def settle_balance(self):
        sorted_balance = sorted(self.balance.items(), key=lambda player: player[1])
        print(sorted_balance)
        transactions = []
        player = sorted_balance[0]
        while player[1] < 0:
            other_player = sorted_balance[-1]
            if -player[1] == other_player[1]:
                transactions.append(
                    f"{player[0]} pays {round(-player[1], 2)} to {other_player[0]}"
                )
                sorted_balance = sorted_balance[1:-1]
            elif -player[1] < other_player[1]:
                transactions.append(
                    f"{player[0]} pays {round(-player[1], 2)} to {other_player[0]}"
                )
                sorted_balance = sorted_balance[1:]
                sorted_balance[-1] = (other_player[0], other_player[1] + player[1])
            else:
                transactions.append(
                    f"{player[0]} pays {round(other_player[1], 2)} to {other_player[0]}"
                )
                sorted_balance = sorted_balance[:-1]
                sorted_balance[0] = (player[0], player[1] + other_player[1])
            if len(sorted_balance) <= 1:
                break
            player = sorted_balance[0]
            print(sorted_balance)
        for transation in transactions:
            print(transation)
