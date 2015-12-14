#!/bin/bash

setPermissions() {
	ssh ubuntu@enclos.ca "
		sudo chown -R ubuntu:webmasters /var/www/<%= props.projectNamespace %>.enclos.ca/public_html &&
		sudo chmod -R 755 /var/www/<%= props.projectNamespace %>.enclos.ca/public_html &&
		sudo chmod -R 775 /var/www/<%= props.projectNamespace %>.enclos.ca/public_html/c/<%= props.projectNamespace %>/admin/thumbnails &&
		sudo chmod -R 775 /var/www/<%= props.projectNamespace %>.enclos.ca/public_html/c/<%= props.projectNamespace %>/file_db
		sudo chmod -R 775 /var/www/<%= props.projectNamespace %>.enclos.ca/public_html/c/<%= props.projectNamespace %>/lang
		sudo chmod -R 775 /var/www/<%= props.projectNamespace %>.enclos.ca/public_html/c/<%= props.projectNamespace %>/img_db";
}

cd ../..

setPermissions

rsync -avzL --progress --no-p --groupmap=*:webmasters --exclude-from=.rsync.exclude . ubuntu@enclos.ca:/var/www/<%= props.projectNamespace %>.enclos.ca/public_html/

rsync -avzL --progress --no-p --groupmap=*:webmasters ./c/<%= props.projectNamespace %>/config/. ubuntu@enclos.ca:/var/www/<%= props.projectNamespace %>.enclos.ca/public_html

rsync -avzLR --progress --no-p --groupmap=*:webmasters --exclude-from=.rsync.exclude ./c/_default ubuntu@enclos.ca:/var/www/<%= props.projectNamespace %>.enclos.ca/public_html/

rsync -avzLR --progress --no-p --groupmap=*:webmasters --exclude-from=.rsync.exclude ./c/<%= props.projectNamespace %> ubuntu@enclos.ca:/var/www/<%= props.projectNamespace %>.enclos.ca/public_html/

setPermissions

cd c/<%= props.projectNamespace %>
