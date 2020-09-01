location /kibana/ { error_page 401 /401$request_uri; rewrite ^/kibana(.*)$ $1
break; proxy_pass http://kibana:5601; }
