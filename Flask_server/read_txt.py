def read_txt_file(filepath):
	lines = []
	with open(filepath, 'r') as file:
		for line in file:
			lines.append(line.strip())
	return lines


if __name__ == "__main__":
	lines = read_txt_file("Database_Handling/initial_card_list.txt")
	print(lines)