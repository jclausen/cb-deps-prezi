namespace :environments do
	task :production_flag do
        on roles(:all) do
        	execute "sed -i -e 's@@application.mode = \"development\";@application.mode = \"production\";@' #{release_path}/Application.cfc"  
        end
    end
end