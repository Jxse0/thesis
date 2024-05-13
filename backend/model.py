import tensorflow as tf

def createModel():
    X = [-7.0, -4.0, -1.0, 2.0, 5.0, 8.0, 11.0, 14.0]
    y = [3.0, 6.0, 9.0, 12.0, 15.0, 18.0, 21.0, 24.0]

    y = tf.cast(tf.constant(y), dtype=tf.float32)
    X = tf.cast(tf.constant(X), dtype=tf.float32)

    tf.random.set_seed(42)

    model = tf.keras.Sequential([
        tf.keras.layers.Dense(1)
    ])

    model.compile(loss=tf.keras.losses.mae,
                optimizer=tf.keras.optimizers.SGD(),
                metrics=["mae"])

    model.fit(tf.expand_dims(X, axis=-1), y, epochs=5)
    return model

model = createModel()

def predict(input):
    global model
    if model is None:
        model = createModel()
    return model.predict([5.0])

