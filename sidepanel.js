document.addEventListener('DOMContentLoaded', function() {
    const apiUrlInput = document.getElementById('api-url');
    const apiKeyInput = document.getElementById('api-key');
    const modelSelect = document.getElementById('model-select');
    const chatContainer = document.getElementById('chat-container');
    const messageInput = document.getElementById('message-input');
    const sendButton = document.getElementById('send-button');

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
