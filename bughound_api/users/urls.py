
from django.conf.urls import url

import users.views as apiVw

urlpatterns = [
    url(r'^export_results/', apiVw.export_results),
    url(r'^groups/', apiVw.GroupView.as_view({'get': 'list'})),
    url(r'^(?P<pk>\d+)', apiVw.UserDetail.as_view()),
    url(r'^', apiVw.UserListView.as_view())
]
