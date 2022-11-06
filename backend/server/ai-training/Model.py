from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense, Dropout

# train_data_len - размер входных данных
# train_lables_len - размер выходных данных

def get_medel(train_data_len, train_lables_len):
    model = Sequential()
    model.add(Dense(128, input_shape=(train_data_len,), activation='relu'))
    model.add(Dropout(0.5))
    model.add(Dense(64, activation='relu'))
    model.add(Dropout(0.5))
    model.add(Dense(train_lables_len, activation='softmax'))
    return model