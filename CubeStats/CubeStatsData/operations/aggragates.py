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
    return {
        "color_id_averages": color_id_averages,
        "draft_pool_averages": draft_pool_averages,
        "color_distribution_of_multi": color_distribution_of_multi,
        "color_distribution_of_commanders": color_distribution_of_commanders
    }