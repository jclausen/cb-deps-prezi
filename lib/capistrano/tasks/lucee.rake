#
# Common lucee Server Actions
#
#set our server type - override downstream in your stage file
set :server_type, 'unix'
  
#lucee service names for windows here or override them downstream in your stage file
set :lucee_service_name, 'Apache Tomcat Lucee'

#Unix binary path for lucee (e.g. - [lucee path]/lucee_ctl)
set :lucee_unix_binary, '/opt/lucee/lucee_ctl'


namespace :lucee do
    
  namespace :windows do
  
      desc 'restart lucee on windows server'
      task :restart do
        on roles(:all) do
          execute "net stop \'#{fetch(:lucee_service_name)}\'"
          execute "net start \'#{fetch(:lucee_service_name)}\'"
          end
      end
    
    desc 'stop lucee on windows server'
    task :stop do
      on roles(:all) do
        execute "net stop \'#{fetch(:lucee_service_name)}\'"
        end
    end
    
    desc 'start lucee on windows server'
    task :start do
      on roles(:all) do
        execute "net start \'#{fetch(:lucee_service_name)}\'"
        end
    end
    
  end #end :windows
  
  namespace :unix do
    
    desc 'restart lucee on unix'
    task :restart do
      on roles(:all) do
        execute "#{fetch(:lucee_unix_binary)} restart"
      end
    end
  
   desc 'stop lucee on unix'
    task :stop do
      on roles(:all) do
        execute "#{fetch(:lucee_unix_binary)} stop"
      end
    end
 

    desc 'start lucee on unix' 
    task :start do
      on roles(:all) do
        execute "#{fetch(:lucee_unix_binary)} start"
      end
    end

  end #end :unix
   
end #end :coldfusion



#:deploy namespace additions
namespace :deploy do
    desc 'Deploy a major release, which requires a restart of our server'
      task :major_release do
        on roles(:all) do
          after "deploy:finished","lucee:#{fetch(:server_type)}:restart"
      end
    end #end major release
end