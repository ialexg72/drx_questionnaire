document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('surveyForm');

    // Загрузка данных из localStorage при загрузке страницы
    loadFormData();

    // Обработчик отправки формы
    form.addEventListener('submit', (e) => {
        e.preventDefault(); // Предотвращаем отправку формы

        const formData = {
            //Общая информация
            organization: document.getElementById('organization').value, //Наименование организации
            version: document.getElementById('version').value, //Версия RX
            redundancy: document.getElementById('redundancy').checked, //Отказоустойчивость
            monitoring: document.getElementById('monitoring').checked, //Мониторинг
            database: document.querySelector('input[name="database"]:checked') ? document.querySelector('input[name="database"]:checked').value : '',
            
            //Активность пользователей
            registeredUsers: document.getElementById('registeredUsers').value, //Кол-во зарегистрированных пользователей
            peakLoad: document.getElementById('peakLoad').value, //Пиковая нагрузка на систему
            peakPeriod: document.getElementById('peakPeriod').value, //Период пиковой нагрузки
            concurrentUsers: document.getElementById('concurrentUsers').value, //Кол-во одновременных пользователей
            mobileappusers: document.getElementById('mobileappusers').value, //Кол-во пользователей мобильных приложений

            //Прирост данных
            importhistorydata: document.getElementById('importhistorydata').value,
            annualdatagrowth: document.getElementById('annualdatagrowth').value,
            midsizedoc: document.getElementById('midsizedoc').value,

            //Импорт данных в систему
            dcs: document.getElementById('dcs').checked,
            dcsdochours: document.getElementById('dcsdochours').value,

            //Интеграция
            onlineeditor: document.getElementById('onlineeditor').value,
            integrationsystems: document.getElementById('integrationsystems').value,

            //Поиск и обработка данных
            elasticsearch: document.getElementById('elasticsearch').checked,
            ario: document.getElementById('ario').checked,
            ariodocin: document.getElementById('ariodocin').value
        };

        // Сохранение данных в localStorage в формате JSON
        localStorage.setItem('surveyData', JSON.stringify(formData));

        // Отображение уведомления с использованием Bootstrap Alerts
        showAlert('Данные успешно сохранены!', 'success');
    });

    // Обработчик кнопки экспорта в XML
    const exportBtn = document.getElementById('exportXml');
    exportBtn.addEventListener('click', () => {
        const savedData = localStorage.getItem('surveyData');
        if (!savedData) {
            showAlert('Нет данных для экспорта.', 'warning');
            return;
        }

        const data = JSON.parse(savedData);
        const xml = jsonToXML(data);

        // Создание ссылки для скачивания
        const blob = new Blob([xml], { type: 'application/xml' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'surveyData.xml';
        a.click();
        URL.revokeObjectURL(url);

        showAlert('Данные успешно экспортированы в XML!', 'success');
    });

    // Функция загрузки данных из localStorage
    function loadFormData() {
        const savedData = localStorage.getItem('surveyData');
        if (savedData) {
            const formData = JSON.parse(savedData);

            document.getElementById('organization').value = formData.organization || '';
            document.getElementById('redundancy').checked = formData.redundancy || false;
            document.getElementById('monitoring').checked = formData.monitoring || false;

            if (formData.database) {
                const dbRadio = document.querySelector(`input[name="database"][value="${formData.database}"]`);
                if (dbRadio) dbRadio.checked = true;
            }

            if (formData.version) { // Загрузка выбранной версии
                const versionSelect = document.getElementById('version');
                versionSelect.value = formData.version;
            }

            document.getElementById('registeredUsers').value = formData.registeredUsers || '';
            document.getElementById('peakLoad').value = formData.peakLoad || '';
            document.getElementById('peakPeriod').value = formData.peakPeriod || '';
            document.getElementById('concurrentUsers').value = formData.concurrentUsers || '';
            document.getElementById('mobileappusers').value = formData.mobileappusers || '';

            //Прирост данных
            document.getElementById('importhistorydata').value = formData.importhistorydata || '';
            document.getElementById('annualdatagrowth').value = formData.annualdatagrowth || '';
            document.getElementById('midsizedoc').value = formData.midsizedoc || '';

            //Импорт данных в систему
            document.getElementById('dcs').checked = formData.dcs || false;
            document.getElementById('dcsdochours').value = formData.dcsdochours || '';

            //Интеграция
            document.getElementById('onlineeditor').value = formData.onlineeditor || '';
            document.getElementById('integrationsystems').value = formData.integrationsystems || '';

            //Поиск и обработка данных
            document.getElementById('elasticsearch').checked = formData.elasticsearch || false;
            document.getElementById('ario').checked = formData.ario || false;
            document.getElementById('ariodocin').value = formData.ariodocin || '';

        }
    }

    // Функция преобразования JSON в XML
    function jsonToXML(obj) {
        let xml = '<?xml version="1.0" encoding="UTF-8"?>\n<SurveyData>\n';
        for (const prop in obj) {
            if (obj.hasOwnProperty(prop)) {
                xml += `  <${prop}>${escapeXML(obj[prop])}</${prop}>\n`;
            }
        }
        xml += '</SurveyData>';
        return xml;
    }

    // Функция экранирования специальных символов в XML
    function escapeXML(str) {
        if (typeof str !== 'string') {
            return str;
        }
        return str.replace(/&/g, '&amp;')

                  .replace(/</g, '&lt;')
                  .replace(/>/g, '&gt;')
                  .replace(/"/g, '&quot;')
                  .replace(/'/g, '&apos;');
    }

    // Функция отображения уведомлений с использованием Bootstrap Alerts
    function showAlert(message, type) {
        // Создаем динамический элемент alert
        const alertDiv = document.createElement('div');
        alertDiv.className = `alert alert-${type} alert-dismissible fade show fixed-top m-3`;
        alertDiv.role = 'alert';
        alertDiv.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Закрыть"></button>
        `;
        document.body.appendChild(alertDiv);

        // Автоматически удаляем alert через 3 секунды
        setTimeout(() => {
            const alert = bootstrap.Alert.getInstance(alertDiv);
            if (alert) {
                alert.close();
            }
        }, 3000);
    }
});
