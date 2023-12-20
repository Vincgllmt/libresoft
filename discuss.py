from time import sleep
import redis

user_connection = redis.Redis(host='localhost', port=6379, decode_responses=True)
p = user_connection.pubsub()
p.subscribe('message', 'info')

while True:
    message = p.get_message()
    if message and message['type'] == 'message':
        print(message)
    sleep(0.2)