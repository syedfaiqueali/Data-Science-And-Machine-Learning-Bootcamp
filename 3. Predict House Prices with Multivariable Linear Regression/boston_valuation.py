from sklearn.datasets import load_boston
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_squared_error

import pandas as pd
import numpy as np



# Gather Data
boston_dataset = load_boston()

# Extracting data from dataset attribute 'data'
data = pd.DataFrame(data=boston_dataset.data, columns=boston_dataset.feature_names)

# Dropping 2 attributes
features = data.drop(['INDUS', 'AGE'], axis=1)

# Storing prices in log
log_prices = np.log(boston_dataset.target)
target = pd.DataFrame(log_prices, columns=['PRICE'])

# Initializing indexes as per dataset
CRIME_IDX = 0
ZN_IDX = 1
CHAS_IDX = 2
RM_IDX = 4
PTRATIO_IDX = 8

ZILLOW_MEDIAN_PRICE = 583.3 # in 000s
SCALE_FACTOR = ZILLOW_MEDIAN_PRICE / np.median(boston_dataset.target) #583.3/21.2

#-----------------------------
#        METHOD :02
#-----------------------------
property_stats = features.mean().values.reshape(1,11)
property_stats

# Linear reg to fit our values
regr = LinearRegression().fit(features, target)

# Based on our features data frame we are calculating all the predicted 
# values using the thetas from our model
fitted_vals = regr.predict(features)

# Calculate MSE and RMSE using sklearn
MSE = mean_squared_error(target, fitted_vals)
RMSE = np.sqrt(MSE)


def get_log_estimate(nr_rooms,
                    students_per_classroom,
                    next_to_river = False,
                    high_confidence = True):
    
    # Configure property
    property_stats[0][RM_IDX] = nr_rooms
    property_stats[0][PTRATIO_IDX] = students_per_classroom
    
    if next_to_river:
        property_stats[0][CHAS_IDX] = 1
    else:
        property_stats[0][CHAS_IDX] = 0
    
    # Making predictions (Log price estimate from the nd-array)
    log_estimate = regr.predict(property_stats)[0][0]
    
    # Calc Range
    if high_confidence:
        # Do 95%. 2-S.d interval
        upper_bound = log_estimate + 2*RMSE
        lower_bound = log_estimate - 2*RMSE
        interval = 95
    else:
        # Do 68%, 1- S.d interval
        upper_bound = log_estimate + RMSE
        lower_bound = log_estimate - RMSE
        interval = 68
        
    # Return all calc
    return log_estimate, upper_bound, lower_bound, interval


def get_dollar_estimate(rm, ptratio, chas=False, large_range=True):
    """
    Estimate the price of a property in Boston.
    
    Keyword arguments:
    rm -- number of rooms in the property
    ptratio -- number of students per teacher in the classroom for the school in the area
    chas -- True if the property is next to the river, False otherwise
    large_range -- True for a 95% prediction interval, False for a 68% interval
    """
    
    # Edge case checking
    if rm < 1 or ptratio < 1:
        print('The paramters which you trying to check is unrealistic. Try again!!!')
        return
    
    # Calling get_log_estimate func
    log_est, upper, lower, conf = get_log_estimate(nr_rooms=rm,
                                       students_per_classroom=ptratio,
                                       next_to_river= chas,
                                       high_confidence=large_range)

    # Convert to today's dollars
    dollar_est = np.e**log_est * 1000 * SCALE_FACTOR
    dollar_hi = np.e**upper * 1000 * SCALE_FACTOR
    dollar_low = np.e**lower * 1000 * SCALE_FACTOR

    # Round the dollar values to nearest thousands
    rounded_est = np.around(dollar_est, -3) # -3 will eliminate extra digits from 000s 
    rounded_hi = np.around(dollar_hi, -3)
    rounded_low = np.around(dollar_low, -3)

    print(f'The estimated property value is: {rounded_est}')
    print(f'At {conf}% confidence the valuation range is.')
    print(f'USD {rounded_low} at the lower end to USD {rounded_hi} at high end.')
