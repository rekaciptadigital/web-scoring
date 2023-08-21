export PATH=/opt/homebrew/bin:$PATH
export NVM_DIR=~/.nvm
source $(brew --prefix nvm)/nvm.sh
export PATH="$(pyenv root)/shims:${PATH}"
echo 'PATH=$(pyenv root)/shims:$PATH'
export PATH="$PATH:/Applications/Visual Studio 
Code.app/Contents/Resources/app/bin"
