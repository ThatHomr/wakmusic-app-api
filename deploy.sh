# !/bin/bash
RUNNING_APPLICATION_1=$(docker ps | grep nest-blue-1)
RUNNING_APPLICATION_2=$(docker ps | grep nest-blue-2)
RUNNING_APPLICATION_3=$(docker ps | grep nest-blue-3)
DEFAULT_CONF="conf/nginx/settings/upstream.conf"

if [ -n "$RUNNING_APPLICATION_1"  ] || [ -n "$RUNNING_APPLICATION_1"  ] || [ -n "$RUNNING_APPLICATION_1"  ];then
	echo "green Deploy..."
    docker build --no-cache --tag wakmusic-server .

    docker-compose up -d nest-green-1
    docker-compose up -d nest-green-2
	docker-compose up -d nest-green-3
	
	while [ 1 == 1 ]; do
		echo "green health check...."
		REQUEST_1=$(docker exec nginx curl http://nest-green-1:8080/api/heartbeat)
        REQUEST_2=$(docker exec nginx curl http://nest-green-2:8080/api/heartbeat)
        REQUEST_3=$(docker exec nginx curl http://nest-green-3:8080/api/heartbeat)
		echo $REQUEST_1
        echo $REQUEST_2
        echo $REQUEST_3
		if [ -n "$REQUEST_1" ] && [ -n "$REQUEST_2" ] && [ -n "$REQUEST_3" ]; then
			break ;
		fi
		sleep 3
	done;
	
	sed -i 's/nest-blue-1/nest-green-1/g' $DEFAULT_CONF
    sed -i 's/nest-blue-2/nest-green-2/g' $DEFAULT_CONF
    sed -i 's/nest-blue-3/nest-green-3/g' $DEFAULT_CONF

	docker exec nginx service nginx reload

	docker-compose stop nest-blue-1
    docker-compose stop nest-blue-2
    docker-compose stop nest-blue-3
else
	echo "blue Deploy..."

    docker build --no-cache --tag wakmusic-server .
    
    docker-compose up -d nest-blue-1
    docker-compose up -d nest-blue-2
	docker-compose up -d nest-blue-3
	
	while [ 1 == 1 ]; do
		echo "blue health check...."
        REQUEST_1=$(docker exec nginx curl http://nest-blue-1:8080/api/heartbeat)
        REQUEST_2=$(docker exec nginx curl http://nest-blue-2:8080/api/heartbeat)
        REQUEST_3=$(docker exec nginx curl http://nest-blue-3:8080/api/heartbeat)
        echo $REQUEST_1
        echo $REQUEST_2
        echo $REQUEST_3
		if [ -n "$REQUEST_1" ] && [ -n "$REQUEST_2" ] && [ -n "$REQUEST_3" ]; then
            break ;
        fi
		sleep 3
    done;
	
	sed -i 's/nest-green-1/nest-blue-1/g' $DEFAULT_CONF
    sed -i 's/nest-green-2/nest-blue-2/g' $DEFAULT_CONF
    sed -i 's/nest-green-3/nest-blue-3/g' $DEFAULT_CONF

    docker exec nginx service nginx reload

	docker-compose stop nest-green-1
    docker-compose stop nest-green-2
    docker-compose stop nest-green-3
fi