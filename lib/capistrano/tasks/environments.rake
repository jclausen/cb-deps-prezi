# ==============================
# Environmental Tasks - Called from stage file
# ==============================

namespace :environments do

    task :production_flag do
        on roles(:all) do
        	execute "sed -i -e 's@@application.mode = \"development\";@application.mode = \"production\";@' #{release_path}/Application.cfc"  
        end
    end
    
    
      desc 'Stop NGINX Webserver'
      task :stop_nginx do
          on roles(:all) do
            execute "service nginx stop"
            execute "service php-fpm stop"
          end
    end

    desc 'Start NGINX Webserver'
    task :start_nginx do
        on roles(:all) do
          execute "service php-fpm start"
          execute "service nginx start"
         end
    end

    desc 'Restart NGINX Webserver'
    task :restart_nginx do
        on roles(:all) do
          execute "service php-fpm restart"
          execute "service nginx restart"
         end
    end

    desc 'Clear NGINX Cache'
    task :clear_nginx_cache do
        on roles(:all) do
          execute "rm -rf /var/lib/nginx/cache/*"
          execute "rm -rf /var/lib/nginx/fastcgi/*"
          execute "rm -rf /var/lib/nginx/proxy/*"
         end
    end

    desc 'Set directory permissions for NGINX'
    task :set_nginx_permissions do
      on roles(:all) do
        execute "chown -R nginx:nginx #{release_path}"
        execute "chown -R nginx:nginx #{shared_path}"
      end
    end  

    desc 'Clear our Application Cache'
    task :clear_app_cache do
        on roles(:all) do
          execute "rm -rf #{shared_path}/cache/*"
          execute "rm -rf #{shared_path}/application/cache/*"
         end
    end
    
end