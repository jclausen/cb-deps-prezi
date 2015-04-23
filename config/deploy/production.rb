set :stage, 'production'
set :branch, 'capified'
# Simple Role Syntax
# ==================
# Supports bulk-adding hosts to roles, the primary server in each group
# is considered to be the first unless any hosts have the primary
# property set.  Don't declare `role :all`, it's a meta role.

role :app, %w{root@cbdepsprezi.silowebworks.com}
role :web, %w{root@cbdepsprezi.silowebworks.com}
role :db,  %w{root@cbdepsprezi.silowebworks.com}

set :app_url, 'http://cbdepsprezi.silowebworks.com/'
set :pw_reinit, 'f1u$h'
set :server_type, 'unix'

# Extended Server Syntax
# ======================
# This can be used to drop a more detailed server definition into the
# server list. The second argument is a, or duck-types, Hash and is
# used to set extended properties on the server.

server 'cbdepsprezi.silowebworks.com', user: 'root', port: 17022, roles: %w{web app}, my_property: :my_value

after "deploy:finishing","lucee:unix:restart"
after "lucee:unix:restart","coldbox:reinit"

