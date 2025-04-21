from operations.queries import *

def get_aggregates(cursor):
    cursor.execute(GET_AVERAGE_PICKS_BY_COLOR_IDENTITY_QUERY)
    color_id_averages = cursor.fetchall()
    cursor.execute(GET_AVERAGE_PICKS_BY_DRAFT_POOL_QUERY)
    draft_pool_averages = cursor.fetchall()
    cursor.execute(GET_COLOR_DISTRIBUTION_OF_MULTI_QUERY)
    color_distribution_of_multi = cursor.fetchall()
    cursor.execute(GET_COLOR_DISTRIBUTION_OF_COMMANDERS_QUERY)
    color_distribution_of_commanders = cursor.fetchall()
    cursor.execute(GET_COLOR_IDS)
    color_ids = cursor.fetchall()
    color_ids = [row[0] for row in color_ids]
    relevant_types = ['Creature', 'Enchantment', 'Instant', 'Sorcery', 'Planeswalker', 'Artifact', 'Land']
    color_id_aggregates = {}
    for color_id in color_ids:
        color_id_aggregates[color_id] = {}
        for relevant_type in relevant_types:
            count = get_types_of_color_id(cursor, color_id, relevant_type)[0]
            color_id_aggregates[color_id][relevant_type] = count
        total = get_total_of_color_id(cursor, color_id)[0]
        color_id_aggregates[color_id]['Total'] = total
            
    return {
        "color_id_averages": color_id_averages,
        "draft_pool_averages": draft_pool_averages,
        "color_distribution_of_multi": color_distribution_of_multi,
        "color_distribution_of_commanders": color_distribution_of_commanders,
        "color_id_aggregates": color_id_aggregates
    }