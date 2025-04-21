from operations.queries import *

def get_colors(cursor):
  cursor.execute(GET_COLOR_IDS_OF_COMMANDERS_QUERY)
  commander_color_ids = cursor.fetchall()
  commander_color_ids = [row[0] for row in commander_color_ids]
  cursor.execute(GET_COLOR_IDS_OF_PICKED_MULTICOLOR_QUERY)
  multicolor_color_ids = cursor.fetchall()
  multicolor_color_ids = [row[0] for row in multicolor_color_ids]
  cursor.execute(GET_COLOR_IDS_OF_SINGLE_COLOR_QUERY)
  single_color_ids = cursor.fetchall()
  single_color_ids = [row[0] for row in single_color_ids]
  cursor.execute(GET_COLOR_IDS_OF_TWO_COLOR_QUERY)
  two_color_ids = cursor.fetchall()
  two_color_ids = [row[0] for row in two_color_ids]
  cursor.execute(GET_COLOR_IDS_OF_THREE_COLOR_QUERY)
  three_color_ids = cursor.fetchall()
  three_color_ids = [row[0] for row in three_color_ids]
  cursor.execute(GET_COLOR_IDS_OF_NOT_PICKED_CARDS_QUERY)
  not_picked_color_ids = cursor.fetchall()
  not_picked_color_ids = [row[0] for row in not_picked_color_ids]
  return {
    "commander_color_ids": commander_color_ids,
    "picked_multicolor_color_ids": multicolor_color_ids,
    "single_color_ids": single_color_ids,
    "two_color_ids": two_color_ids,
    "three_color_ids": three_color_ids,
    "not_picked_color_ids": not_picked_color_ids
  }