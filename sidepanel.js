document.addEventListener('DOMContentLoaded', function() {
    const apiUrlInput = document.getElementById('api-url');
    const apiKeyInput = document.getElementById('api-key');
    const modelSelect = document.getElementById('model-select');
    const chatContainer = document.getElementById('chat-container');
    const messageInput = document.getElementById('message-input');
    const sendButton = document.getElementById('send-button');

    const configButton = document.getElementById('config-button');
    const configPanel = document.getElementById('config-panel');
    const saveButton = document.getElementById('save-button');

    chrome.storage.local.get(['url', 'api', 'modelName'], function(result) {
        apiUrlInput.value = result.url || '';
        apiKeyInput.value = result.api || '';
        modelSelect.value = result.modelName || 'gpt-3.5-turbo';
    });

    configButton.addEventListener('click', function() {
        configPanel.style.display = configPanel.style.display === 'none' ? 'block' : 'none';
    });

    saveButton.addEventListener('click', function() {
        const apiUrl = apiUrlInput.value;
        const apiKey = apiKeyInput.value;
        const modelName = modelSelect.value;

        chrome.storage.local.set({
            url: apiUrl,
            api: apiKey,
            modelName: modelName
        }, function() {
            alert('配置已保存');
        });
    });

    sendButton.addEventListener('click', function() {
        const apiUrl = apiUrlInput.value;
        const apiKey = apiKeyInput.value;
        const model = modelSelect.value;
        const message = messageInput.value;

        if (apiUrl && apiKey && model && message) {
            // 将用户消息添加到聊天容器
            const userMessage = document.createElement('div');
            userMessage.classList.add('message', 'user');
            userMessage.textContent = '你: ' + message;
            chatContainer.appendChild(userMessage);

            // 添加加载动画
            const loadingMessage = document.createElement('div');
            loadingMessage.classList.add('message', 'bot');
            loadingMessage.textContent = '大模型思考中...';
            chatContainer.appendChild(loadingMessage);
            chatContainer.scrollTop = chatContainer.scrollHeight;

            // 发送消息到后台脚本
            chrome.runtime.sendMessage({
                type: 'chat',
                apiUrl: apiUrl,
                apiKey: apiKey,
                model: model,
                message: message
            }, function(response) {
                // 移除加载动画
                chatContainer.removeChild(loadingMessage);

                // 将大模型响应添加到聊天容器
                const botMessage = document.createElement('div');
                botMessage.classList.add('message', 'bot');
                botMessage.textContent = '大模型: ' + response.message;
                chatContainer.appendChild(botMessage);

                // 清空消息输入框
                messageInput.value = '';

                // 滚动到聊天容器底部
                chatContainer.scrollTop = chatContainer.scrollHeight;
            });
        } else {
            const errorMessage = document.createElement('div');
            errorMessage.classList.add('message', 'error');
            errorMessage.textContent = '请填写所有字段';
            chatContainer.appendChild(errorMessage);
        }
    });
});
